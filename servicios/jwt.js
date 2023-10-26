// importar dependencias 
const jwt = require("jwt-simple");
const moment = require("moment");

// clave secreta
const secret = ")R,kpwFyMVif;Z70-0ixm2AGN{yz.j#?)}xY+b?W-Tm-dA-6)2wvF8Rv(*NG0WxuUc?SFeK#B:jq8uQR,CRU=zR_m28%d4@p$aK@rmNRqS!46zt6_L.Dm(F+Sb+C]4D_)xJ#bk10+:=wQp:v.WBQSVu)(i:tPj)kQ%.w2+Rw3)qf0A1U89(H:k7qY!dm2{/0VFi4=KCAF)SWMq$,7C7)i.Lp:ATt[34eN1SS6CiBKi@tQAhf:MVNZL2&dnBC951uNZXkk2[52,RdJ%?M)e&zy@g((9w+/J},kGk33L";

// crear una funcion para generar token

const createToken = (user) =>{
    const payload = {
        id:user.id,
        nombre:user.nombre,
        apellido:user.apellido,
        nick:user.nick,
        correo:user.correo,
        id_rol:user.id_rol,
        image:user.image,
        iat: moment().unix(),
        exp: moment().add(1,"hours").unix()
    }

    // Devolver un jwt token codificado
    return jwt.encode(payload,secret);
}

module.exports = {
    secret,
    createToken
}