const inputChecker = (type, data) => {
    switch (type) {
        case 'email':
            return emailChecker(data)
        case 'phone':
            return phoneChecker(data)
        case 'text':
            return xssChecker(data)
    }
}

const emailChecker = data => {
    const emailRegX = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/
    if (emailRegX.test(data)) {
        return true
    } else {
        return false
    }
}

const phoneChecker = data => {
    const phoneRegX = /^09[0-9]/
    if (data.length != 10) {
        return false
    } else {
        if (phoneRegX.test(data)) {
            return true
        }
    }
}

const xssChecker = data => {
    const xssRegX = /<[^>]*>|javascript:(.*)/i;
    if(xssRegX.test(data)){
        return false
    }else{
        return true
    }
}

export default inputChecker