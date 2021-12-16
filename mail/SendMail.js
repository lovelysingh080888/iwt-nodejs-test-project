const nodemailer = require("nodemailer");

exports.sendMail = async (user) => {
  try {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: '"Lovely" <lovelysingh0808888@gmail.com>',
      to: user.email,
      subject: "Registered Successfully",
      html: "<b>Welcome " + user.name + "</b>",
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log(error);
  }
};
