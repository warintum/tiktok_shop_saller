const iconv = require('iconv-lite');

function convertthaiToAs400(strBefore) {
    let strAfter = '';
    for (let i = 0; i < strBefore.length; i++) {
        const ch = strBefore.charCodeAt(i);
        console.log(ch);
//âäàáãåçêëèíîïìÂÄÀÁÃÅÇÊËÈÍÎÏÌ«»ðýþ±ªæÆ¤¡¿ÐÝÞ®
        switch (ch) {      
            case 3585: strAfter += iconv.encode('â', 'windows-874').toString('binary'); break; // ก
            case 3586: strAfter += iconv.encode('ä', 'windows-874').toString('binary'); break; // ข
            case 3587: strAfter += iconv.encode('à', 'windows-874').toString('binary'); break; // ฃ
            case 3588: strAfter += iconv.encode('á', 'windows-874').toString('binary'); break; // ค
            case 3589: strAfter += iconv.encode('ฅ', 'windows-874').toString('binary'); break; // ฅ
            case 3590: strAfter += iconv.encode('ฆ', 'windows-874').toString('binary'); break; // ฆ
            case 3591: strAfter += iconv.encode('ง', 'windows-874').toString('binary'); break; // ง
            case 3592: strAfter += iconv.encode('จ', 'windows-874').toString('binary'); break; // จ
            case 3593: strAfter += iconv.encode('ฉ', 'windows-874').toString('binary'); break; // ฉ
            case 3594: strAfter += iconv.encode('ช', 'windows-874').toString('binary'); break; // ช
            case 3595: strAfter += iconv.encode('ซ', 'windows-874').toString('binary'); break; // ซ
            case 3596: strAfter += iconv.encode('ฌ', 'windows-874').toString('binary'); break; // ฌ
            case 3597: strAfter += iconv.encode('ญ', 'windows-874').toString('binary'); break; // ญ
            case 3598: strAfter += iconv.encode('ฎ', 'windows-874').toString('binary'); break; // ฎ
            case 3599: strAfter += iconv.encode('ฏ', 'windows-874').toString('binary'); break; // ฏ
            case 3600: strAfter += iconv.encode('ฐ', 'windows-874').toString('binary'); break; // ฐ 
            case 3601: strAfter += iconv.encode('ฑ', 'windows-874').toString('binary'); break; // ฑ
            case 3602: strAfter += iconv.encode('ฒ', 'windows-874').toString('binary'); break; // ฒ
            case 3603: strAfter += iconv.encode('ณ', 'windows-874').toString('binary'); break; // ณ
            case 3604: strAfter += iconv.encode('ด', 'windows-874').toString('binary'); break; // ด
            case 3605: strAfter += iconv.encode('ต', 'windows-874').toString('binary'); break; // ต
            case 3606: strAfter += iconv.encode('ถ', 'windows-874').toString('binary'); break; // ถ
            case 3607: strAfter += iconv.encode('ท', 'windows-874').toString('binary'); break; // ท
            case 3608: strAfter += iconv.encode('ธ', 'windows-874').toString('binary'); break; // ธ
            case 3609: strAfter += iconv.encode('น', 'windows-874').toString('binary'); break; // น
            case 3610: strAfter += iconv.encode('บ', 'windows-874').toString('binary'); break; // บ
            case 3611: strAfter += iconv.encode('ป', 'windows-874').toString('binary'); break; // ป
            case 3612: strAfter += iconv.encode('ผ', 'windows-874').toString('binary'); break; // ผ
            case 3613: strAfter += iconv.encode('ฝ', 'windows-874').toString('binary'); break; // ฝ
            case 3614: strAfter += iconv.encode('พ', 'windows-874').toString('binary'); break; // พ
            case 3615: strAfter += iconv.encode('ฟ', 'windows-874').toString('binary'); break; // ฟ
            case 3616: strAfter += iconv.encode('ภ', 'windows-874').toString('binary'); break; // ภ
            case 3617: strAfter += iconv.encode('ม', 'windows-874').toString('binary'); break; // ม
            case 3618: strAfter += iconv.encode('ย', 'windows-874').toString('binary'); break; // ย
            case 3619: strAfter += iconv.encode('ร', 'windows-874').toString('binary'); break; // ร
            case 3620: strAfter += iconv.encode('ฤ', 'windows-874').toString('binary'); break; // ฤ
            case 3621: strAfter += iconv.encode('ล', 'windows-874').toString('binary'); break; // ล
            case 3622: strAfter += iconv.encode('ฦ', 'windows-874').toString('binary'); break; // ฦ
            case 3623: strAfter += iconv.encode('ว', 'windows-874').toString('binary'); break; // ว
            case 3624: strAfter += iconv.encode('ศ', 'windows-874').toString('binary'); break; // ศ
            case 3625: strAfter += iconv.encode('ษ', 'windows-874').toString('binary'); break; // ษ
            case 3626: strAfter += iconv.encode('ส', 'windows-874').toString('binary'); break; // ส
            case 3627: strAfter += iconv.encode('ห', 'windows-874').toString('binary'); break; // ห
            case 3628: strAfter += iconv.encode('ฬ', 'windows-874').toString('binary'); break; // ฬ
            case 3629: strAfter += iconv.encode('อ', 'windows-874').toString('binary'); break; // อ
            case 3630: strAfter += iconv.encode('ฮ', 'windows-874').toString('binary'); break; // ฮ
            case 3631: strAfter += iconv.encode('ฯ', 'windows-874').toString('binary'); break; // ฯ
            case 3632: strAfter += iconv.encode('ะ', 'windows-874').toString('binary'); break; // ะ
            case 3633: strAfter += iconv.encode('ั', 'windows-874').toString('binary'); break; // อั
            case 3634: strAfter += iconv.encode('า', 'windows-874').toString('binary'); break; // า
            case 3635: strAfter += iconv.encode('ำ', 'windows-874').toString('binary'); break; // อำ
            case 3636: strAfter += iconv.encode('ิ', 'windows-874').toString('binary'); break; // อิ
            case 3637: strAfter += iconv.encode('ี', 'windows-874').toString('binary'); break; // อี
            case 3638: strAfter += iconv.encode('ึ', 'windows-874').toString('binary'); break; // อึ
            case 3639: strAfter += iconv.encode('ื', 'windows-874').toString('binary'); break; // อื
            case 3640: strAfter += iconv.encode('ุ', 'windows-874').toString('binary'); break; // อุ
            case 3641: strAfter += iconv.encode('ู', 'windows-874').toString('binary'); break; // อู
            case 3642: strAfter += iconv.encode('ฺ', 'windows-874').toString('binary'); break; // อฺ 
            case 3647: strAfter += iconv.encode('฿', 'windows-874').toString('binary'); break; // ฿
            case 3648: strAfter += iconv.encode('เ', 'windows-874').toString('binary'); break; // เ
            case 3649: strAfter += iconv.encode('แ', 'windows-874').toString('binary'); break; // แ
            case 3650: strAfter += iconv.encode('โ', 'windows-874').toString('binary'); break; // โ
            case 3651: strAfter += iconv.encode('ใ', 'windows-874').toString('binary'); break; // ใ
            case 3652: strAfter += iconv.encode('ไ', 'windows-874').toString('binary'); break; // ไ
            case 3653: strAfter += iconv.encode('ๅ', 'windows-874').toString('binary'); break; // ๅ
            case 3654: strAfter += iconv.encode('ๆ', 'windows-874').toString('binary'); break; // ๆ
            case 3655: strAfter += iconv.encode('็', 'windows-874').toString('binary'); break; // ็
            case 3656: strAfter += iconv.encode('่', 'windows-874').toString('binary'); break; // ่
            case 3657: strAfter += iconv.encode('้', 'windows-874').toString('binary'); break; // ้
            case 3658: strAfter += iconv.encode('๊', 'windows-874').toString('binary'); break; // ๊
            case 3659: strAfter += iconv.encode('๋', 'windows-874').toString('binary'); break; // ๋
            case 3660: strAfter += iconv.encode('์', 'windows-874').toString('binary'); break; // ์
            case 3661: strAfter += iconv.encode('ํ', 'windows-874').toString('binary'); break; // ํ
            case 3662: strAfter += iconv.encode('๎', 'windows-874').toString('binary'); break; // ๎
            case 3663: strAfter += iconv.encode('๏', 'windows-874').toString('binary'); break; // ๏
            case 3664: strAfter += iconv.encode('๐', 'windows-874').toString('binary'); break; // ๐
            case 3665: strAfter += iconv.encode('๑', 'windows-874').toString('binary'); break; // ๑
            case 3666: strAfter += iconv.encode('๒', 'windows-874').toString('binary'); break; // ๒
            case 3667: strAfter += iconv.encode('๓', 'windows-874').toString('binary'); break; // ๓
            case 3668: strAfter += iconv.encode('๔', 'windows-874').toString('binary'); break; // ๔
            case 3669: strAfter += iconv.encode('๕', 'windows-874').toString('binary'); break; // ๕
            case 3670: strAfter += iconv.encode('๖', 'windows-874').toString('binary'); break; // ๖
            case 3671: strAfter += iconv.encode('๗', 'windows-874').toString('binary'); break; // ๗
            case 3672: strAfter += iconv.encode('๘', 'windows-874').toString('binary'); break; // ๘
            case 3673: strAfter += iconv.encode('๙', 'windows-874').toString('binary'); break; // ๙
            case 3674: strAfter += iconv.encode('๚', 'windows-874').toString('binary'); break; // ๚
            case 3675: strAfter += iconv.encode('๛', 'windows-874').toString('binary'); break; // ๛
            case 8204: break; // ตัวอักษรพิเศษ (ZWNJ) ใช้เพื่อยกเว้นไม่ทำอะไร
            default: strAfter += strBefore[i]; break; // ตัวอักษรอื่นๆ ที่ไม่ได้ระบุไว้
        }
        
    }
    console.log('strAfter: ', strAfter);
    return strAfter;
}
module.exports = convertthaiToAs400;
