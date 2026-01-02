const odbc = require('odbc');

function getAS400Config() {
    return {
        //dsn: 'LIBBPCSCDF',
        dsn: 'TESTF',
        uid: 'ssa',
        pwd: 'ssa',
        ccsid: '1208'
    };
}

function createConnectionString(config) {
    return `Dsn=${config.dsn};uid=${config.uid};pwd=${config.pwd};CCSID=${config.ccsid || '1208'}`;
}

async function connectToAS400() {
    try {
        const config = getAS400Config();
        const connectionString = createConnectionString(config);
        const connection = await odbc.connect(connectionString);
        return connection;
    } catch (error) {
        console.error('Connection failed:', error);
        throw new Error('ไม่สามารถเชื่อมต่อกับระบบ AS400 ได้: ' + error.message);
    }
}

// Manual Thai Character Mapping (Unicode to AS400/EBCDIC specific char code)
function convertThaiToAS400(input) {
    if (!input) return '';

    let result = '';

    for (let i = 0; i < input.length; i++) {
        const charCode = input.charCodeAt(i);

        switch (charCode) {
            case 3585: result += String.fromCharCode(226); break; // ก
            case 3586: result += String.fromCharCode(228); break; // ข
            case 3587: result += String.fromCharCode(224); break; // ฃ
            case 3588: result += String.fromCharCode(225); break; // ค
            case 3589: result += String.fromCharCode(227); break; // ฅ
            case 3590: result += String.fromCharCode(229); break; // ฆ
            case 3591: result += String.fromCharCode(231); break; // ง
            case 3592: result += String.fromCharCode(234); break; // จ
            case 3593: result += String.fromCharCode(235); break; // ฉ
            case 3594: result += String.fromCharCode(232); break; // ช
            case 3595: result += String.fromCharCode(237); break; // ซ
            case 3596: result += String.fromCharCode(238); break; // ฌ
            case 3597: result += String.fromCharCode(239); break; // ญ
            case 3598: result += String.fromCharCode(236); break; // ฎ
            case 3599: result += String.fromCharCode(194); break; // ฏ
            case 3600: result += String.fromCharCode(196); break; // ฐ
            case 3601: result += String.fromCharCode(192); break; // ฑ
            case 3602: result += String.fromCharCode(193); break; // ฒ
            case 3603: result += String.fromCharCode(195); break; // ณ
            case 3604: result += String.fromCharCode(197); break; // ด
            case 3605: result += String.fromCharCode(199); break; // ต
            case 3606: result += String.fromCharCode(202); break; // ถ
            case 3607: result += String.fromCharCode(203); break; // ท
            case 3608: result += String.fromCharCode(200); break; // ธ
            case 3609: result += String.fromCharCode(205); break; // น
            case 3610: result += String.fromCharCode(206); break; // บ
            case 3611: result += String.fromCharCode(207); break; // ป
            case 3612: result += String.fromCharCode(204); break; // ผ
            case 3613: result += String.fromCharCode(171); break; // ฝ
            case 3614: result += String.fromCharCode(187); break; // พ
            case 3615: result += String.fromCharCode(240); break; // ฟ
            case 3616: result += String.fromCharCode(253); break; // ภ
            case 3617: result += String.fromCharCode(254); break; // ม
            case 3618: result += String.fromCharCode(177); break; // ย
            case 3619: result += String.fromCharCode(170); break; // ร
            case 3620: result += String.fromCharCode(186); break; // ฤ
            case 3621: result += String.fromCharCode(230); break; // ล
            case 3622: result += String.fromCharCode(184); break; // ฦ
            case 3623: result += String.fromCharCode(198); break; // ว
            case 3624: result += String.fromCharCode(164); break; // ศ
            case 3625: result += String.fromCharCode(161); break; // ษ
            case 3626: result += String.fromCharCode(191); break; // ส
            case 3627: result += String.fromCharCode(208); break; // ห
            case 3628: result += String.fromCharCode(221); break; // ฬ
            case 3629: result += String.fromCharCode(222); break; // อ
            case 3630: result += String.fromCharCode(174); break; // ฮ

            case 3631: result += String.fromCharCode(91); break;  // ฯ
            case 3632: result += String.fromCharCode(93); break;  // ะ
            case 3633: result += String.fromCharCode(175); break; // อั
            case 3634: result += String.fromCharCode(168); break; // า
            case 3635: result += String.fromCharCode(180); break; // อำ
            case 3636: result += String.fromCharCode(215); break; // อิ
            case 3637: result += String.fromCharCode(244); break; // อี
            case 3638: result += String.fromCharCode(246); break; // อึ
            case 3639: result += String.fromCharCode(242); break; // อื
            case 3640: result += String.fromCharCode(243); break; // อุ
            case 3641: result += String.fromCharCode(245); break; // อู
            case 3642: result += String.fromCharCode(185); break; // อฺ

            case 3647: result += String.fromCharCode(248); break; // ฿
            case 3648: result += String.fromCharCode(251); break; // เ
            case 3649: result += String.fromCharCode(252); break; // แ
            case 3650: result += String.fromCharCode(249); break; // โ
            case 3651: result += String.fromCharCode(250); break; // ใ
            case 3652: result += String.fromCharCode(255); break; // ไ
            case 3653: result += String.fromCharCode(178); break; // ๅ
            case 3654: result += String.fromCharCode(212); break; // ๆ

            case 3655: result += String.fromCharCode(214); break; // อ็
            case 3656: result += String.fromCharCode(210); break; // อ่
            case 3657: result += String.fromCharCode(211); break; // อ้
            case 3658: result += String.fromCharCode(213); break; // อ๊
            case 3659: result += String.fromCharCode(179); break; // อ๋

            case 3660: result += String.fromCharCode(219); break; // อ์
            case 3661: result += String.fromCharCode(220); break; // อํ
            case 3662: result += String.fromCharCode(201); break; // อ๎

            case 3663: result += String.fromCharCode(216); break; // ๏
            case 3664: result += String.fromCharCode(94); break;  // ๐
            case 3665: result += String.fromCharCode(163); break; // ๑
            case 3666: result += String.fromCharCode(165); break; // ๒
            case 3667: result += String.fromCharCode(183); break; // ๓
            case 3668: result += String.fromCharCode(169); break; // ๔
            case 3669: result += String.fromCharCode(167); break; // ๕
            case 3670: result += String.fromCharCode(182); break; // ๖
            case 3671: result += String.fromCharCode(188); break; // ๗
            case 3672: result += String.fromCharCode(189); break; // ๘
            case 3673: result += String.fromCharCode(190); break; // ๙
            case 3674: result += String.fromCharCode(176); break; // ๚
            case 3675: result += String.fromCharCode(181); break; // ๛

            default: result += input.charAt(i); break;
        }
    }

    return result;
}

// Convert from AS400 (Reverse mapping - simplified for now, can be expanded if needed)
function convertThaiFromAS400(text) {
    // For now, we'll return the text as is or implement reverse mapping if critical.
    // Given the user request focused on SENDING, the priority is convertThaiToAS400.
    // The previous implementation had a map, we can keep using a similar approach if needed,
    // but for now let's focus on the requested manual mapping for sending.
    return text;
}

function processOHAD(strOHAD1, strOHAMP, strOHPOV) {
    strOHAD1 = (strOHAD1 || '').trim();
    strOHAMP = (strOHAMP || '').trim();
    strOHPOV = (strOHPOV || '').trim();

    const s = '                                             '; // 45 spaces

    // Logic from C# ProcessOHAD
    if ((strOHAD1 + " " + strOHAMP + " " + strOHPOV).length < 45) {
        strOHAD1 = strOHAD1 + " " + strOHAMP + " " + strOHPOV;
        if (strOHAD1.length < 45) {
            strOHAD1 = strOHAD1 + s.substring(0, 45 - strOHAD1.length);
        }
    } else if ((strOHAD1 + " " + strOHAMP).length < 45) {
        strOHAD1 = strOHAD1 + " " + strOHAMP;
        if (strOHAD1.length < 45) {
            strOHAD1 = strOHAD1 + s.substring(0, 45 - strOHAD1.length) + " " + strOHPOV;
        }
    } else if (strOHAD1.length < 45) {
        strOHAD1 = strOHAD1 + s.substring(0, 45 - strOHAD1.length);
        strOHAD1 = strOHAD1 + " " + strOHAMP + " " + strOHPOV;
    } else {
        strOHAD1 = strOHAD1 + " " + strOHAMP + " " + strOHPOV;
    }

    if (strOHAD1.length > 90) {
        strOHAD1 = strOHAD1.substring(0, 90);
    }

    return strOHAD1;
}

module.exports = {
    connectToAS400,
    convertThaiToAS400,
    convertThaiFromAS400,
    processOHAD
};
