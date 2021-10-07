import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Libra Platform Admin'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
