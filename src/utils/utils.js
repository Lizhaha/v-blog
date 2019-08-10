let req_address = "http://192.168.187.1:8080/v-blog";
let avatar_url = "../assets/images";
let warning_text = "抱歉！该功能正在开拓中...";


let Conversiontime = (timestamp) => {
    let date = new Date(timestamp),Y,M,D,h,m,s;
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = (date.getDate()<10?'0'+(date.getDate()):date.getDate()) + ' ';
    h = (date.getHours()<10?'0'+(date.getHours()):date.getHours()) + ':';
    m = (date.getMinutes()<10?'0'+(date.getMinutes()):date.getMinutes())+':';
    s = (date.getSeconds()<10?'0'+(date.getSeconds()):date.getSeconds());
    return Y+M+D+h+m+s;
}

export default {
    req_address,
    avatar_url,
    Conversiontime,
    warning_text
}