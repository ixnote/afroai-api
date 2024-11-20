class DeactivateAccountMail {
  constructor(email, subject = "Deactivation of Account Confirmation", user, url) {
    this.email = email;
    this.subject = subject;
    this.user = user;
    this.url = url;
    this.template = "default";
  }

  setBody() {
    this.body = {
      body: {
        title: `Hi ${this.user.firstname}`,
        intro: [
          `<p>This email is to confirm that your account is about to be deactivated. If you did not request this deletion, please contact us immediately. If the request was made by you, please click on the link below to confirm the deactivation of your account.</p>
     
    <p>${this.url}</p> `,
        ],
      },
    };

    return this.body;
  }
}

module.exports = DeactivateAccountMail;
