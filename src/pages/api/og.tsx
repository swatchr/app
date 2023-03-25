import { ImageResponse } from '@vercel/og';

import type { NextRequest } from 'next/server';
// @SEE: https://medium.com/frontendweb/what-is-og-image-generation-and-how-to-use-with-nextjs-58b42800f48e

// @SEE:  https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation
// enable experimental edage

export const config = {
  runtime: 'edge',
};

export default function handler(req: NextRequest) {
  try {
    //  get searchParams
    const { searchParams } = new URL(req.url);

    // ?title=<title>
    const hasName = searchParams.has('name');

    const hasColors = searchParams.has('colors');

    // add default title
    const name = hasName ? searchParams.get('name')?.slice(0, 100) : '';

    const Colors = hasColors
      ? searchParams
          .get('colors')
          ?.split('-')
          .map((c) => `#${c}` || [])
      : ['#000'];

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexWrap: 'nowrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              width: '100%',
              flex: 1,
              flexWrap: 'nowrap',
            }}
          >
            {Colors?.length &&
              Colors?.map((color, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: color as string,
                    height: '100%',
                    width: `${1200 / Colors.length}px`,
                    display: 'flex',
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    flexWrap: 'nowrap',
                  }}
                >
                  <p
                    style={{
                      color: 'white',
                      backgroundColor: 'black',
                      padding: '3px 4px',
                      fontSize: '6rem',
                      fontWeight: 600,
                    }}
                  >
                    {color}
                  </p>
                </div>
              ))}
          </div>
          <div
            style={{
              display: 'flex',
              width: '100%',
              padding: '16px',
              justifyContent: 'space-between',
              backgroundColor: 'black',
              color: 'white',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              width="300"
              height="100"
              src="https://cdn.jsdelivr.net/gh/swatchr/app@main/public/swatchr-full-transp.png"
              alt="Swatchr Logo"
            />
            <h2>{name}</h2>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 640,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response('Failed to generate the image', {
      status: 500,
    });
  }
}
