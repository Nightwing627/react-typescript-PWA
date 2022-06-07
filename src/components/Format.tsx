export const ChangePhoneFormat = (phoneNumber) =>{
  const p = phoneNumber.split(")");

  if(p[1]){
    const p1 = p[0].substr(p.length - 1);
    const p2 = p[1] && p[1].split("-");
    return `+91 ${p1}${p2[0]}${p2[1]}`
  }
  else{
    const p1 = p[0] && p[0].substr(p.length - 7);
    const p2 = p[0] && p[0].substr(0, 3);
    return `+91 ${p2} ${p1}`
  }
};