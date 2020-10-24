const title = 'Iono | Share links to your phone'
const description = 'Share links to your phone.'
const url = 'https://iono.mael.tech/'

module.exports = {
  title,
  description,
  canonical: url,
  openGraph: {
    title,
    description,
    url,
    site_name: title,
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    handle: '@mattaelphick',
    site: '@mattaelphick',
    cardType: 'summary_large_image',
  },
}
