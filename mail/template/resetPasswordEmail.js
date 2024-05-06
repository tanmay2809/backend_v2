exports.resetPasswordEmail = (resetPasswordUrl) => {
  return `<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>Reset Password</title>
  <style>
    body {
      background-color: #ffffff;
      font-family: Arial, sans-serif;
      font-size: 16px;
      line-height: 1.4;
      color: #333333;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
    }

    .logo {
      max-width: 200px;
      margin-bottom: 20px;
    }

    .message {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .body {
      font-size: 16px;
      margin-bottom: 20px;
    }

    .cta {
      display: inline-block;
      padding: 10px 20px;
      background-color: #FFD60A;
      color: #000000;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
      font-weight: bold;
      margin-top: 20px;
    }

    .support {
      font-size: 14px;
      color: #999999;
      margin-top: 20px;
    }

    .highlight {
      font-weight: bold;
    }
  </style>
</head>

<body>
  <div class="container">
    <a href="#">
      <img class="logo" src="https://s3groupsnackbae.s3.ap-south-1.amazonaws.com/1712446123862" alt="E-Swachh Logo">
    </a>
    <div class="message">Reset Your Password</div>
    <div class="body">
      <p>You recently requested to reset your password for your Snackbae account. Use the button below to reset it. <br> <strong>Please note that this link is valid for the next 5 minutes only.</strong></p>
      <a class="cta" href="${resetPasswordUrl}">Reset Password</a>
    </div>
    <div class="support">If you did not request a password reset, please ignore this email or contact us at 
      <a  href="mailto:contact@snackbae.in">contact@snackbae.in</a>. We are here to help!</div>
  </div>
</body>

</html>`;
};
