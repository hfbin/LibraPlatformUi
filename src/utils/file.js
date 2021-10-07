export function fileDown(data, title) {
  if (window.URL.createObjectURL(new Blob([data])).indexOf(location.host) < 0) {
    window.navigator.msSaveOrOpenBlob(new Blob([data]), title)
  } else {
    const url = window.URL.createObjectURL(new Blob([data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', title)
    document.body.appendChild(link)
    link.click()
  }
}
