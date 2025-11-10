function convertThaiToEBCDIC(strBefore) {
    let strAfter = '';
    for (let i = 350; i < 400; i++) {
        const ch = strBefore.charCodeAt(i);
        console.log(ch);




        switch (i) {

            case i: strAfter += String.fromCharCode(i); break; // ก

           /* case 3585: strAfter += String.fromCharCode(226); break; // ก
            case 3586: strAfter += String.fromCharCode(228); break; // ข
            case 3587: strAfter += String.fromCharCode(224); break; // ฃ
            case 3588: strAfter += String.fromCharCode(225); break; // ค
            case 3589: strAfter += String.fromCharCode(227); break; // ฅ
            case 3590: strAfter += String.fromCharCode(229); break; // ฆ
            case 3591: strAfter += String.fromCharCode(231); break; // ง
            case 3592: strAfter += String.fromCharCode(234); break; // จ
            case 3593: strAfter += String.fromCharCode(235); break; // ฉ
            case 3594: strAfter += String.fromCharCode(232); break; // ช
            case 3595: strAfter += String.fromCharCode(237); break; // ซ
            case 3596: strAfter += String.fromCharCode(238); break; // ฌ
            case 3597: strAfter += String.fromCharCode(239); break; // ญ
            case 3598: strAfter += String.fromCharCode(236); break; // ฎ
            case 3599: strAfter += String.fromCharCode(194); break; // ฏ
            case 3600: strAfter += String.fromCharCode(196); break; // ฐ 
            case 3601: strAfter += String.fromCharCode(192); break; // ฑ
            case 3602: strAfter += String.fromCharCode(193); break; // ฒ
            case 3603: strAfter += String.fromCharCode(195); break; // ณ
            case 3604: strAfter += String.fromCharCode(197); break; // ด
            case 3605: strAfter += String.fromCharCode(199); break; // ต
            case 3606: strAfter += String.fromCharCode(202); break; // ถ
            case 3607: strAfter += String.fromCharCode(203); break; // ท
            case 3608: strAfter += String.fromCharCode(200); break; // ธ
            case 3609: strAfter += String.fromCharCode(205); break; // น
            case 3610: strAfter += String.fromCharCode(206); break; // บ
            case 3611: strAfter += String.fromCharCode(207); break; // ป
            case 3612: strAfter += String.fromCharCode(204); break; // ผ
            case 3613: strAfter += String.fromCharCode(171); break; // ฝ
            case 3614: strAfter += String.fromCharCode(187); break; // พ
            case 3615: strAfter += String.fromCharCode(240); break; // ฟ
            case 3616: strAfter += String.fromCharCode(253); break; // ภ
            case 3617: strAfter += String.fromCharCode(254); break; // ม
            case 3618: strAfter += String.fromCharCode(177); break; // ย
            case 3619: strAfter += String.fromCharCode(170); break; // ร
            case 3620: strAfter += String.fromCharCode(186); break; // ฤ
            case 3621: strAfter += String.fromCharCode(230); break; // ล
            case 3622: strAfter += String.fromCharCode(184); break; // ฦ
            case 3623: strAfter += String.fromCharCode(198); break; // ว
            case 3624: strAfter += String.fromCharCode(164); break; // ศ
            case 3625: strAfter += String.fromCharCode(161); break; // ษ
            case 3626: strAfter += String.fromCharCode(191); break; // ส
            case 3627: strAfter += String.fromCharCode(208); break; // ห
            case 3628: strAfter += String.fromCharCode(221); break; // ฬ
            case 3629: strAfter += String.fromCharCode(222); break; // อ
            case 3630: strAfter += String.fromCharCode(174); break; // ฮ
            case 3631: strAfter += String.fromCharCode(91); break;  // ฯ
            case 3632: strAfter += String.fromCharCode(93); break;  // ะ
            case 3633: strAfter += String.fromCharCode(175); break; // อั
            case 3634: strAfter += String.fromCharCode(168); break; // า
            case 3635: strAfter += String.fromCharCode(180); break; // อำ
            case 3636: strAfter += String.fromCharCode(215); break; // อิ
            case 3637: strAfter += String.fromCharCode(244); break; // อี
            case 3638: strAfter += String.fromCharCode(246); break; // อึ
            case 3639: strAfter += String.fromCharCode(242); break; // อื
            case 3640: strAfter += String.fromCharCode(243); break; // อุ
            case 3641: strAfter += String.fromCharCode(245); break; // อู
            case 3642: strAfter += String.fromCharCode(185); break; // อฺ 
            case 3647: strAfter += String.fromCharCode(248); break; // ฿
            case 3648: strAfter += String.fromCharCode(251); break; // เ
            case 3649: strAfter += String.fromCharCode(252); break; // แ
            case 3650: strAfter += String.fromCharCode(249); break; // โ
            case 3651: strAfter += String.fromCharCode(250); break; // ใ
            case 3652: strAfter += String.fromCharCode(255); break; // ไ
            case 3653: strAfter += String.fromCharCode(178); break; // ๅ
            case 3654: strAfter += String.fromCharCode(212); break; // ๆ
            case 3655: strAfter += String.fromCharCode(214); break; // อ็
            case 3656: strAfter += String.fromCharCode(210); break; // อ่
            case 3657: strAfter += String.fromCharCode(211); break; // อ้
            case 3658: strAfter += String.fromCharCode(213); break; // อ๊
            case 3659: strAfter += String.fromCharCode(179); break; // อ๋
            case 3660: strAfter += String.fromCharCode(219); break; // อ์
            case 3661: strAfter += String.fromCharCode(220); break; // อํ
            case 3662: strAfter += String.fromCharCode(201); break; // อ๎
            case 3663: strAfter += String.fromCharCode(216); break; // ๏
            case 3664: strAfter += String.fromCharCode(94); break;  // ๐
            case 3665: strAfter += String.fromCharCode(163); break; // ๑
            case 3666: strAfter += String.fromCharCode(165); break; // ๒
            case 3667: strAfter += String.fromCharCode(183); break; // ๓
            case 3668: strAfter += String.fromCharCode(169); break; // ๔
            case 3669: strAfter += String.fromCharCode(167); break; // ๕
            case 3670: strAfter += String.fromCharCode(182); break; // ๖
            case 3671: strAfter += String.fromCharCode(188); break; // ๗
            case 3672: strAfter += String.fromCharCode(189); break; // ๘
            case 3673: strAfter += String.fromCharCode(190); break; // ๙
            case 3674: strAfter += String.fromCharCode(176); break; // ๚
            case 3675: strAfter += String.fromCharCode(181); break; // ๛*/
            default: strAfter += ''; break;
           /* default:
                strAfter += ''; // String.fromCharCode(ch) ไม่พบการแปลงที่ตรงกัน ให้ใช้ตัวอักษรเดิม
                break;*/
        }
    }
    console.log('strAfter: ', strAfter);
    return strAfter;
}

module.exports = convertThaiToEBCDIC;