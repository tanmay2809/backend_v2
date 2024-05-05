exports.becomePartnerEmail = () => {
  return `<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>Payment Confirmation</title>
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
    <img class="logo" src= "https://s3groupsnackbae.s3.ap-south-1.amazonaws.com/1712446123862",
"
    alt="E-Swachh Logo"></a>
    <div class="message">Welcome to the Snackbae</div>
    <div class="body">
      
      <p>thank you for showing interest in snackbae our sales Representative will react out to you at earliest </p><br/>
    
    </div>
    <div class="support">If you have any questions or need assistance, please feel free to reach out to us at 
    <a  href="mailto:contact@snackbae.in">contact@snackbae.in</a>. We are here to help!</div>
  </div>
</body>

</html>`;
};
