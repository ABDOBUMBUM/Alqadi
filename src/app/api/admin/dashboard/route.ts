import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Run all counts in parallel for speed
    const [
      clientCount,
      bookingCount,
      jobCount,
      hotelCount,
      visaCount,
      employeeCount,
      ticketOpenCount,
      leadCount,
      recentBookings,
      recentLogs,
      bookingRevenue,
      bookingsByStatus,
      bookingsByService,
    ] = await Promise.all([
      prisma.client.count(),
      prisma.booking.count(),
      prisma.job.count({ where: { active: true } }),
      prisma.hotel.count({ where: { active: true } }),
      prisma.visa.count({ where: { active: true } }),
      prisma.employee.count({ where: { active: true } }),
      prisma.supportTicket.count({ where: { status: "open" } }),
      prisma.lead.count(),

      // Recent bookings with client info
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { client: { select: { name: true } }, employee: { select: { name: true } } },
      }),

      // Recent audit logs
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { employee: { select: { name: true } } },
      }),

      // Total revenue from bookings
      prisma.booking.aggregate({
        _sum: { totalAmount: true, paidAmount: true },
      }),

      // Bookings grouped by status
      prisma.booking.groupBy({
        by: ["status"],
        _count: { id: true },
        _sum: { totalAmount: true },
      }),

      // Bookings grouped by service type
      prisma.booking.groupBy({
        by: ["serviceType"],
        _count: { id: true },
        _sum: { totalAmount: true },
      }),
    ]);

    // Monthly revenue for chart (last 12 months)
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    
    const monthlyBookings = await prisma.booking.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: { createdAt: true, totalAmount: true },
    });

    // Group by month
    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
      const monthBookings = monthlyBookings.filter(b => {
        const d = new Date(b.createdAt);
        return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth();
      });
      return {
        month: monthKey,
        revenue: monthBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
        count: monthBookings.length,
      };
    });

    return NextResponse.json({
      counts: {
        clients: clientCount,
        bookings: bookingCount,
        jobs: jobCount,
        hotels: hotelCount,
        visas: visaCount,
        employees: employeeCount,
        openTickets: ticketOpenCount,
        leads: leadCount,
      },
      revenue: {
        total: bookingRevenue._sum.totalAmount || 0,
        paid: bookingRevenue._sum.paidAmount || 0,
        outstanding: (bookingRevenue._sum.totalAmount || 0) - (bookingRevenue._sum.paidAmount || 0),
      },
      bookingsByStatus,
      bookingsByService,
      monthlyRevenue,
      recentBookings: recentBookings.map(b => ({
        id: b.id,
        client: b.client?.name || "—",
        employee: b.employee?.name || "—",
        serviceType: b.serviceType,
        status: b.status,
        totalAmount: b.totalAmount,
        currency: b.currency,
        createdAt: b.createdAt,
      })),
      recentLogs: recentLogs.map(l => ({
        id: l.id,
        action: l.action,
        entity: l.entity,
        entityId: l.entityId,
        employee: l.employee?.name || "النظام",
        createdAt: l.createdAt,
      })),
    });
  } catch (e) {
    console.error("Dashboard API error:", e);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
