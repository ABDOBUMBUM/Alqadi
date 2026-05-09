import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#030303',
          color: '#c9a227',
          fontSize: 100,
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
        }}
      >
        Q
      </div>
    ),
    { ...size }
  )
}
