const nodeMailer = require('../config/nodemailer');
const Post = require('../models/post');

// this is another way of exporting a method
exports.newComment = async(comment) => {
    let htmlString = nodeMailer.renderTemplate({ comment: comment }, '/comments/new_comment.ejs');
    //console.log(comment)
    const e = comment.post;
    let post = await Post.findById(e);
    post = await post.populate('user', 'email')
        //console.log("POST", post);


    nodeMailer.transporter.sendMail({
        from: 'vachnaram49@gmail.com',
        to: post.user.email,
        subject: "New Comment Published!",
        html: htmlString
    }, (err, info) => {
        if (err) {
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Message sent', info);
        return;
    });
}