import { useState } from 'react'

const genBookmarklet = (code: string) => `
javascript: (function () {
  try {
    var token = '${code}';
    var url = window.location.href;
    var title = (document.querySelector('h1.title.ytd-video-primary-info-renderer') && document.querySelector('h1.title.ytd-video-primary-info-renderer').innerText) || document.title || undefined;
    try {
      var val = document.querySelector('.ytp-time-current').innerText;
      var parts = val.split(':');
      if (parts.length < 3) {
        parts.unshift('0')
      }
      var hoursSeconds = Number(parts[0]) * 60 * 60;
      var minuteSeconds = Number(parts[1]) * 60;
      var seconds = Number(parts[2]);
      var total = hoursSeconds + minuteSeconds + seconds;
      url = url + '&t=' + total;
    }
    console.info('Sending to', newUrl);
    fetch('https://iono.mael.tech/api/transmit', {
      method: 'POST',
      body: JSON.stringify({
        token,
        title,
        url
      })
    })
  } catch (e) {
    console.error(e);
  }
})()
`

export default function Index() {
  const [code, setCode] = useState('')
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', maxWidth: '80vw' }}>
        <div style={{ fontSize: '5em', marginTop: '6vh', flex: 1 }}>Iono</div>
        <div style={{ marginBottom: '1em' }}>
          Download the Android .apk{' '}
          <a style={{ textDecorationLine: 'underline' }} href="https://github.com/maael/iono/releases">
            here
          </a>
          , the latest is{' '}
          <a
            style={{ textDecorationLine: 'underline' }}
            href="https://github.com/maael/iono/releases/download/v1.0.0/iono-43101b659ea645e6874ee2dd325e5762-signed.apk"
          >
            here.
          </a>
          .
        </div>
        <div style={{ marginBottom: '1em' }}>
          Use the app to get a code, and paste it here, then use the special bookmarklet below to send your pages to
          your phone.
        </div>
        <input
          style={{
            appearance: 'none',
            border: 'none',
            padding: 10,
            margin: 10,
            backgroundColor: '#8E8DA4',
            color: '#FFFFFF',
          }}
          type="text"
          placeholder="Special code..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'row',
          width: '100vw',
          height: '50vh',
          bottom: 0,
          left: 0,
          position: 'absolute',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            backgroundColor: '#5B5D7A',
            top: '0vh',
            width: '200vmax',
            height: '200vmax',
            borderRadius: '200vmax',
          }}
        />
        <div
          style={{
            position: 'absolute',
            backgroundColor: '#8E8DA4',
            top: '7vh',
            width: '200vmax',
            height: '200vmax',
            borderRadius: '200vmax',
          }}
        />
        <div
          style={{
            position: 'absolute',
            backgroundColor: '#0F82AF',
            top: '10vh',
            width: '200vmax',
            height: '200vmax',
            borderRadius: '200vmax',
          }}
        />
        <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', textAlign: 'center' }}>
          <a
            style={{
              textDecoration: `underline ${!code ? 'line-through' : ''}`,
              fontSize: '3em',
              cursor: !code ? 'not-allowed' : 'grab',
            }}
            href={genBookmarklet(code)}
            title="Iono"
          >
            Iono
          </a>
          <div>
            Drag the link above to your bookmark bar{code ? '' : ` once you've added your code in the box above`}.
          </div>
        </div>
      </div>
    </div>
  )
}
