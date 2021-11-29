import { createTransport } from 'nodemailer';

export const sendEmail = async (to: string, html: string) => {
  try {
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: 'alphazero25811@gmail.com',
        pass: 'cjnztrguylflsfby',
      },
    });

    // send mail with defined transport object
    await transporter.sendMail({
      from: '<Alpha Zero> alphazero25811@gmail.com',
      to,
      subject: 'Email confirmation', // Subject line
      text: 'Please click the link below to confirm your account.', // plain text body
      html,
    });
  } catch (err) {
    console.log(err);
  }
};
