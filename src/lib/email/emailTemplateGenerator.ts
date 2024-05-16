const nodemailer = require("nodemailer");

type Params = {
	identifier: string;
	code: string;
};

/**
 * Send email verification request
 *
 * @async
 * @param {Params} param0
 * @param {string} param0.identifier - Email address
 * @param {string} param0.code - Verification code
 * @returns {Promise<void>}
 */
export async function sendVerificationRequest({ identifier, code }: Params): Promise<void> {
	console.log(
		process.env.SMTP_USER,
		process.env.SMTP_PASS,
		process.env.SMTP_HOST,
		process.env.SMTP_PORT
	);
	const transport = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		secure: true,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	});
	const result = await transport.sendMail({
		to: identifier,
		from: process.env.SMTP_USER,
		subject: `RCollabs email verification`,
		text: "Verify your email address",
		html: html({ code }),
	});
	const failed = result.rejected.concat(result.pending).filter(Boolean);
	if (failed.length) {
		throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
	}
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
function html(params: { code: string }) {
	const { code } = params;

	return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>Verify your email address</title>
          <style type="text/css" rel="stylesheet" media="all">
              /* Base ------------------------------ */
              *:not(br):not(tr):not(html) {
                  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
                  -webkit-box-sizing: border-box;
                  box-sizing: border-box;
              }
              body {
                  width: 100% !important;
                  height: 100%;
                  margin: 0;
                  line-height: 1.4;
                  background-color: #f5f7f9;
                  color: #839197;
                  -webkit-text-size-adjust: none;
              }
              a {
                  color: #414ef9;
              }
  
              /* Layout ------------------------------ */
              .email-wrapper {
                  width: 100%;
                  margin: 0;
                  padding: 0;
                  background-color: #191919;
              }
              .email-content {
                  width: 100%;
                  margin: 0;
                  padding: 0;
              }
  
              /* Masthead ----------------------- */
              .email-masthead {
                  padding: 25px 0;
                  text-align: center;
                  background: #191919;
                  display: flex;
                  justify-content: center;
              }
              .email-masthead_container {
                  display: flex;
                  max-width: calc(570px);
                  padding: 0 35px;
                  width: 100%;
                  justify-content: space-between;
              }
              .email-masthead_container p {
                  font-weight: bold;
                  margin: 0;
                  padding: 0;
              }
              .email-masthead_logo {
                  max-width: 400px;
                  border: 0;
              }
              .email-masthead_name {
                  font-size: 16px;
                  font-weight: bold;
                  color: #fff;
                  text-decoration: none;
              }
  
              /* Banner ------------------------------ */
              .banner-container {
                  max-width: calc(570px - 35px - 35px);
                  height: 4rem;
                  border-radius: 10px;
                  overflow: hidden;
              }
  
              .banner-container img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
              }
  
              /* Body ------------------------------ */
              .email-body {
                  width: 100%;
                  margin: 0;
                  padding: 0;
                  border-top: 1px solid #e7eaec;
                  border-bottom: 1px solid #e7eaec;
                  background-color: #f9f8f6;
              }
              .email-body_inner {
                  width: 570px;
                  margin: 0 auto;
                  padding: 0;
              }
              .email-footer {
                  width: 570px;
                  margin: 0 auto;
                  padding: 0;
                  text-align: center;
                  background-color: #191919;
              }
              .email-footer p {
                  color: #839197;
              }
              .body-action {
                  width: 100%;
                  margin: 30px auto;
                  padding: 0;
                  text-align: center;
              }
              .body-sub {
                  margin-top: 25px;
                  padding-top: 25px;
                  border-top: 1px solid #e7eaec;
              }
              .content-cell {
                  padding: 35px;
              }
              .align-right {
                  text-align: right;
              }
              .content-intro {
                  text-align: center;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
              }
  
              .content-intro h1,
              .content-intro p {
                  text-align: center;
              }
  
              /* Type ------------------------------ */
              h1 {
                  margin-top: 0;
                  color: #292e31;
                  font-size: 19px;
                  font-weight: bold;
                  text-align: left;
              }
              h2 {
                  margin-top: 0;
                  color: #292e31;
                  font-size: 16px;
                  font-weight: bold;
                  text-align: left;
              }
              h3 {
                  margin-top: 0;
                  color: #292e31;
                  font-size: 14px;
                  font-weight: bold;
                  text-align: left;
              }
              p {
                  margin-top: 0;
                  color: #839197;
                  font-size: 16px;
                  line-height: 1.5em;
                  text-align: left;
              }
              p.sub {
                  font-size: 12px;
              }
              p.center {
                  text-align: center;
              }
  
              /* Buttons ------------------------------ */
              .button {
                  display: inline-block;
                  width: 200px;
                  background-color: #414ef9;
                  border-radius: 3px;
                  color: #ffffff;
                  font-size: 15px;
                  line-height: 45px;
                  text-align: center;
                  text-decoration: none;
                  -webkit-text-size-adjust: none;
                  mso-hide: all;
              }
              .button--green {
                  background-color: #28db67;
              }
              .button--red {
                  background-color: #ff3665;
              }
              .button--blue {
                  background-color: #414ef9;
              }
  
              .verification-code-container {
                  display: flex;
                  gap: 10px;
                  align-items: center;
                  justify-content: center;
              }
  
              .verification-code-container h1 {
                  font-size: 1.75rem;
                  font-weight: bold;
              }
  
              .highlight-link {
                  color: #414141;
              }
  
              .light-accent {
                  border: 0;
                  height: 1px;
                  background-color: #c9c9c9;
              }
  
              /*Media Queries ------------------------------ */
              @media only screen and (max-width: 600px) {
                  .email-body_inner,
                  .email-footer {
                      width: 100% !important;
                  }
              }
              @media only screen and (max-width: 500px) {
                  .button {
                      width: 100% !important;
                  }
              }
          </style>
      </head>
      <body>
          <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                  <td align="center">
                      <table class="email-content" width="100%" cellpadding="0" cellspacing="0">
                          <!-- Logo -->
                          <tr>
                              <td class="email-masthead">
                                  <div class="email-masthead_container">
                                      <a class="email-masthead_name">Co.</a>
                                      <p>RCollabs</p>
                                  </div>
                              </td>
                          </tr>
                          <!-- Email Body -->
                          <tr>
                              <td class="email-body" width="100%">
                                  <table
                                      class="email-body_inner"
                                      align="center"
                                      width="570"
                                      cellpadding="0"
                                      cellspacing="0"
                                  >
                                      <!-- Body content -->
                                      <tr>
                                          <td class="content-cell">
                                              <div class="banner-container">
                                                  <img src="./gradient-bg-4.png" alt="" />
                                              </div>
                                              <br />
                                              <div class="content-intro">
                                                  <h1>Verify your email address</h1>
                                                  <p>
                                                      Thanks for signing up in RCollabs! We're excited
                                                      to have you as an early user.
                                                  </p>
                                              </div>
                                              <!-- Action -->
                                              <table
                                                  class="body-action"
                                                  align="center"
                                                  width="100%"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                              >
                                                  <tr>
                                                      <td align="center">
                                                          <div>
                                                              <!--[if mso
                                                                  ]><v:roundrect
                                                                      xmlns:v="urn:schemas-microsoft-com:vml"
                                                                      xmlns:w="urn:schemas-microsoft-com:office:word"
                                                                      href="{{action_url}}"
                                                                      style="
                                                                          height: 45px;
                                                                          v-text-anchor: middle;
                                                                          width: 200px;
                                                                      "
                                                                      arcsize="7%"
                                                                      stroke="f"
                                                                      fill="t"
                                                                  >
                                                                      <v:fill
                                                                          type="tile"
                                                                          color="#414EF9"
                                                                      />
                                                                      <w:anchorlock />
                                                                      <center
                                                                          style="
                                                                              color: #ffffff;
                                                                              font-family: sans-serif;
                                                                              font-size: 15px;
                                                                          "
                                                                      >
                                                                          Verify Email
                                                                      </center>
                                                                  </v:roundrect><!
                                                              [endif]-->
                                                              <!-- <a href="{{action_url}}" class="button button--blue">Verify Email</a> -->
                                                              <div
                                                                  class="verification-code-container"
                                                              >
                                                              ${code
																	.split("")
																	.map((c) => `<h1>${c}</h1>`)
																	.join("")}
                                                                  
                                                              </div>
                                                          </div>
                                                      </td>
                                                  </tr>
                                              </table>
                                              <p class="center">
                                                  Kindly use the verification code above to verify
                                                  your email address.
                                              </p>
                                              <br />
                                              <hr class="light-accent" />
                                              <p class="center">
                                                  If you have any questions, feel free to reach out at
                                                  <a
                                                      class="highlight-link"
                                                      href="https://www.iamwayne.tech/contact"
                                                      >https://www.iamwayne.tech/contact</a
                                                  >
                                              </p>
                                              <!-- Sub copy -->
                                              <br />
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          <tr>
                              <td>
                                  <table
                                      class="email-footer"
                                      align="center"
                                      width="570"
                                      cellpadding="0"
                                      cellspacing="0"
                                  >
                                      <tr>
                                          <td class="content-cell">
                                              <p class="sub center">
                                                  Canvas Labs, Inc.
                                                  <br />325 9th St, San Francisco, CA 94103
                                              </p>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>
  </html>
  
`;
}
