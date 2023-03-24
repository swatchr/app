import { ImageResponse } from '@vercel/og';

import type { NextRequest } from 'next/server';
import { LogoIcon } from '../../components/v1/icons/swatchr/logo-icon';

// enable experimental edage

export const config = {
  runtime: 'experimental-edge',
};

export default function handler(req: NextRequest) {
  try {
    //  get searchParams
    const { searchParams } = new URL(req.url);

    // ?title=<title>
    const hasTitle = searchParams.has('title');

    const hasColors = searchParams.has('colors');

    // add default title
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'Untitled';

    const Colors = hasColors
      ? searchParams
          .get('colors')
          ?.split('-')
          .map((c) => `#${c}` || [])
      : ['#000'];

    // // ?title=<title>&BgColor="blue"
    // const hasBgColor = searchParams.has('BgColor');

    // // ?title=<title>&BgColor="blue"&color="black"
    // const hasColor = searchParams.has('color');

    // // add default BgColor
    // const BgColor = hasBgColor ? searchParams.get('BgColor') : 'lightblue';

    // // add default color
    // const Color = hasColor ? searchParams.get('color') : 'black';

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
                />
              ))}
          </div>
          <div
            style={{
              display: 'flex',
              width: '100%',
              padding: '16px',
              justifyContent: 'space-between',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              width="100"
              height="100"
              src="https://cdn.jsdelivr.net/gh/swatchr/app@main/public/swatchr-full-transp.png"
              alt="Swatchr Logo"
            />
            <h2>{title}</h2>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 640,
        debug: true,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response('Failed to generate the image', {
      status: 500,
    });
  }
}
