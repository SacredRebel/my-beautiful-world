// Shared email bodies for transactional sends via Resend.
const COVER = 'https://library.edenverse.earth/assets/cover.jpg';
const DOWNLOAD = 'https://whop.com/joined/eden-verse/downloads-3HhpQRaiTkAHyy/app/';
const SAMPLE = 'https://library.edenverse.earth/assets/My-Beautiful-World-Sample.pdf';
const CHECKOUT = 'https://whop.com/checkout/plan_vcHU3P33oWwsa/';

function shell(inner) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=edge"></head>
<body style="margin:0;padding:0;background-color:#FDF8EF;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FDF8EF" style="background-color:#FDF8EF;"><tr>
<td align="center" style="padding-top:32px;padding-bottom:32px;padding-left:16px;padding-right:16px;">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
<tr><td align="center" style="padding-bottom:26px;">
<img src="${COVER}" width="420" height="315" border="0" alt="My Beautiful World" style="display:block;width:420px;height:315px;border-radius:10px;">
</td></tr>
${inner}
<tr><td align="center" style="border-top-width:1px;border-top-style:solid;border-top-color:#EFE6D3;padding-top:22px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td align="center" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#9a9182;padding-bottom:6px;">Made with love in Ojai, California &middot; part of the Edenverse</td></tr>
<tr><td align="center" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#9a9182;"><a href="https://edenverse.earth" style="color:#9a9182;text-decoration:underline;">edenverse.earth</a></td></tr>
</table></td></tr>
</table></td></tr></table></body></html>`;
}

function btn(href, label) {
  return `<tr><td align="center" style="padding-bottom:30px;"><table cellpadding="0" cellspacing="0" border="0"><tr>
<td align="center" bgcolor="#C6A15B" style="background-color:#C6A15B;border-radius:999px;">
<a href="${href}" style="display:inline-block;font-family:Arial,Helvetica,sans-serif;font-size:17px;line-height:20px;color:#ffffff;text-decoration:none;font-weight:bold;padding-top:16px;padding-bottom:16px;padding-left:36px;padding-right:36px;">${label}</a>
</td></tr></table></td></tr>`;
}
function h1(t){return `<tr><td align="center" style="font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:34px;color:#3A322E;padding-bottom:14px;">${t}</td></tr>`;}
function lead(t){return `<tr><td align="center" style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:26px;color:#6b6357;padding-bottom:28px;">${t}</td></tr>`;}
function para(t){return `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:25px;color:#4a4038;padding-bottom:18px;">${t}</td></tr>`;}
function card(title, body){
  return `<tr><td bgcolor="#ffffff" style="background-color:#ffffff;border-radius:14px;padding:24px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:24px;color:#3A322E;padding-bottom:14px;">${title}</td></tr>
<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#4a4038;">${body}</td></tr>
</table></td></tr><tr><td style="height:26px;line-height:26px;">&nbsp;</td></tr>`;
}

exports.DOWNLOAD = DOWNLOAD;
exports.SAMPLE = SAMPLE;

exports.bookDelivery = function () {
  return {
    subject: 'Your book is ready \u{1F49B}',
    html: shell(
      h1('Thank you &mdash; your book is ready.') +
      lead('Your copy of <em>My Beautiful World</em> is waiting for you now.') +
      btn(DOWNLOAD, 'Open your book') +
      card('How to find it, now and always',
        '<strong>1.</strong> Click the button above.<br><strong>2.</strong> Sign in with this email address &mdash; the one you used at checkout.<br><strong>3.</strong> Your book is under <strong>Downloads</strong>. Open it, or save the PDF to your device.<br><br>' +
        'A free account was created for you with this email, so you can download the book again whenever you like, on any device. There is nothing more to pay, ever.') +
      para('A gentle suggestion for the first read: do not try to read every language. Pick the one your child hears at home, point at a picture, and say the word. That is the whole method.') +
      para('If anything goes wrong, just reply to this email and I will help.') +
      para('Edenverse is the small studio behind this book &mdash; a family project from Ojai, California. <em>My Beautiful World</em> is the first in a growing series.')
    ),
    text: `Thank you - your book is ready.

Your copy of My Beautiful World is waiting for you now.

Open your book: ${DOWNLOAD}

1. Click the link above.
2. Sign in with this email address - the one you used at checkout.
3. Your book is under "Downloads". Open it, or save the PDF to your device.

A free account was created for you with this email, so you can download the book again whenever you like, on any device.

A gentle suggestion for the first read: do not try to read every language. Pick the one your child hears at home, point at a picture, and say the word.

If anything goes wrong, just reply to this email.

Edenverse is the small studio behind this book - a family project from Ojai, California. My Beautiful World is the first in a growing series.

edenverse.earth`
  };
};

exports.freeSample = function () {
  return {
    subject: 'Your 3 free pages \u{1F49B}',
    html: shell(
      h1('Here are your 3 free pages.') +
      lead('The Face, The Lion and The Night Sky &mdash; three real spreads from the book.') +
      btn(SAMPLE, 'Download your 3 free pages') +
      card('How to read it with a small child',
        'Do not try to read every language. Pick the one your child hears at home, point at a picture, and say the word. Each language keeps its own colour on every page, so their eye learns the pattern long before they can read.') +
      para('The full book is 45 illustrated pages and 274 first words, in English, German, Romanian, Spanish, Italian and Sanskrit.') +
      btn(CHECKOUT, 'Get the whole book &mdash; $12')
    ),
    text: `Here are your 3 free pages.

The Face, The Lion and The Night Sky - three real spreads from the book.

Download: ${SAMPLE}

How to read it with a small child: do not try to read every language. Pick the one your child hears at home, point at a picture, and say the word.

The full book is 45 illustrated pages and 274 first words, in six languages.

Get the whole book - $12: ${CHECKOUT}

edenverse.earth`
  };
};
