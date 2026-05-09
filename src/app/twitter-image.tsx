import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #000000, #1a1a1a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#c9a227',
        }}
      >
        <div style={{ fontSize: 120, fontWeight: 'bold', marginBottom: 20 }}>
          AlQadi Group
        </div>
        <div style={{ fontSize: 40, color: '#f0e6d2' }}>
          السفريات، السياحة، وخدمات الأيادي العاملة
        </div>
      </div>
    ),
    { ...size }
  )
}
