// cookies constants

export const REFERRAL_CODE = 'referralCode'

// cookies functions

export const getCookie = (name: string) => {
  const matches = document.cookie.match(
    new RegExp(
      // eslint-disable-next-line no-useless-escape
      `(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`
    )
  )
  return matches ? matches[1] : ''
}

export function setCookie(name: string, value: string, days?: number) {
  const cookie: {
    [name: string]: string | undefined
    path: string
    expires?: string
  } = { [name]: value, path: '/', expires: undefined }

  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    cookie.expires = date.toUTCString()
  }

  const arr = []
  for (const key in cookie) {
    arr.push(`${key}=${cookie[key]}`)
  }

  document.cookie = arr.join('; ')

  return getCookie(name)
}

export function deleteCookie(name: string) {
  setCookie(name, '', -1)
}
