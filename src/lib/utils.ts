export const handleAnchorClick = (event) => {
    event.preventDefault()
    const link = event.currentTarget
    const anchorId = new URL(link.href).hash.replace('#', '')
    const anchor = document.getElementById(anchorId)
    window.scrollTo({
        top: anchor.offsetTop,
        behavior: 'smooth'
    })
}

const redirectDelay = 500
export const redirect = (location: string) => setTimeout(() => { window.location.href = location }, redirectDelay)

export async function logout() {
    setCookie('token', null, null)
    redirect('/')
    // const response = await fetch('http://localhost:8080/api/auth/logout')

    // if (response.ok) {
    //     redirect('/')
    //     console.log('LOGOUT SUCCESS', response)

    // } else {
    //     console.log('Ошибка HTTP: ' + response.status)
    // }
}

export function getCookie(name) {
    const cookieName = name + '='
    const decodedCookie = decodeURIComponent(document.cookie)
    const ca = decodedCookie.split(';')
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(cookieName) == 0) {
            return c.substring(cookieName.length, c.length)
        }
    }
    return ''
}

export function setCookie(name, value, exdays, secure?) {
    const d = new Date()
    d.setTime(d.getTime() + (exdays*24*60*60*1000))
    const expires = 'expires='+ d.toUTCString()
    if (secure) {
        document.cookie = name + '=' + value + ';' + expires + ';path=/; secure'
    } else {
        document.cookie = name + '=' + value + ';' + expires + ';path=/'
    }
}

export function deleteCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;'
}

export const truncate = (str: string, n = 18) => {
    const split = str.split('.')
    const extension = split[1]

    return (str.length > n) ? str.slice(0, n-1) + '..' + `.${extension}` : str
}

export const filter = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(predicate))
export const removeKeyNames = (obj) => {
    const newObj = {}
    Object.keys(obj).forEach(function(key) {
        newObj[key.split('.')[1]] = obj[key]
    })
    return newObj
}