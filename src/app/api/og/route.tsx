import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const savings = searchParams.get('savings');
    const tools = searchParams.get('tools');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            backgroundImage: 'radial-gradient(circle at 25% 25%, #111 0%, #000 100%)',
            color: '#fff',
            fontFamily: 'sans-serif',
            padding: '80px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
              opacity: 0.8,
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#fff',
                marginRight: '15px',
              }}
            />
            <span style={{ fontSize: '32px', fontWeight: 'bold', letterSpacing: '-1px' }}>
              Credex AI Audit
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#888',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}
            >
              Total Annual Savings
            </span>
            <span
              style={{
                fontSize: '128px',
                fontWeight: 900,
                color: '#fff',
                marginBottom: '40px',
                letterSpacing: '-5px',
              }}
            >
              ${Number(savings).toLocaleString()}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              padding: '20px 40px',
              borderRadius: '100px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#aaa',
            }}
          >
            Optimized across {tools} AI tools
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
