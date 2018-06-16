const coinGenesToEyes = (genes) => {

    let image = '';
    const NUM_EYE_TYPES = 2;

    genes = NUM_EYE_TYPES % 2;

    switch (+genes) {
        case 0: image = '01'; break;
        case 1: image = '02'; break;
        default: image = '01';
    }

    return `/static/coinLooks/eyes/${image}.png`;
}

export default coinGenesToEyes;