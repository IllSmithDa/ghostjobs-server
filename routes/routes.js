// @ts-nocheck 
const UserControllers = require('../Controllers/UsersController');
const OauthController = require('../Controllers/OAuthController');
const EmailController = require('../Controllers/EmailController');
const StoryController = require('../Controllers/StoryController');
const CommentController = require('../Controllers/CommentController');
const ReactionController = require('../Controllers/ReactionController');
const StoryReactionController = require('../Controllers/StoryReactionController');
const ReportController = require('../Controllers/ReportController')
const SearchController = require('../Controllers/SearchController');
const AdminController = require('../Controllers/AdminController');
const Session = require('../Middleware/Session');

module.exports = (server) => {
  server.route('/api/users/register-user')
    .post(UserControllers.registerUser)
  server.route('/api/users/login-user')
    .post(UserControllers.loginUser)
  server.route('/api/users/logout-user')
    .get(Session.checkSession,UserControllers.logoutUser)
  server.route('/api/users/get-user-session')
    .get(Session.checkSession, UserControllers.getUserSession)
  server.route('/api/users/change-password')
    .put(UserControllers.changePassword);

  // https://stackoverflow.com/questions/73434687/cannot-get-auth-google-callback-passportjs
  server.route('/auth/google')
    .get(OauthController.oauthLoginUser);
  server.route('/auth/google/callback')
    .get(OauthController.callbackRoute);
  server.route('/api/story/post-story')
    .post(Session.checkSession,
      StoryController.postStory);
  server.route('/api/story/stories/:username/:offset/:limit')
    .get(StoryController.getMyStories);
    //https://expressjs.com/en/guide/routing.html
    // https://stackoverflow.com/questions/34704593/express-routes-parameters
  server.route('/api/story/:storyId')
    .get(StoryController.getStory);
  // https://stackoverflow.com/questions/15128849/using-multiple-parameters-in-url-in-express
  server.route('/api/story/by-date/:offset/:limit')
    .post(StoryController.storiesByDate);
  server.route('/api/story/update-story')
    .put(StoryController.updateStory);
  server.route('/api/story/delete-story/:storyId')
    .delete(StoryController.deleteStory);

  // comments 
  server.route('/api/story/comments/post')
    .post(CommentController.createComment);
  server.route('/api/story/comments/:storyId/:offset/:limit')
    .get(CommentController.getComments);
  server.route('/api/story/my-comments/:username/:offset/:limit')
    .get(CommentController.getMyComments);
  server.route('/api/story/delete-comment')
    .post(CommentController.deleteComment);
  server.route('/api/story/comment/add-reply')
    .put(CommentController.addReplyV1);
  server.route('/api/story/delete-reply')
    .delete(CommentController.deleteReply);
  server.route('/api/story/comment/:commentId')
    .get(CommentController.getComment)
  server.route('/api/story/reply/:commentId/:replyId')
    .get(CommentController.getReply)

  server.route('/api/reactions/add-comment-score')
    .post(ReactionController.addCommentScore);
  server.route('/api/reactions/remove-comment-score')
    .delete(ReactionController.removeCommentScore);
  server.route('/api/reactions/comment-reactions/:username')
    .get(ReactionController.geCommentReactions);

  
  server.route('/api/reactions/add-reply-score')
    .post(ReactionController.addRelyScore);
  server.route('/api/story/reaction/:storyId/:username')
    .get(StoryReactionController.checkStoryReaction);
  server.route('/api/story/reaction/create-reaction')
    .post(StoryReactionController.createReaction);
  server.route('/api/story/reaction/delete/:username/:storyId')
    .delete(StoryReactionController.deleteReaction);
  server.route('/api/story/story-reactions/:username/:offset/:limit')
    .get(StoryReactionController.getMyStoryReactions);
  server.route('/api/story/get-text/:storyId')
    .get(StoryController.getStoryText);
  server.route('/api/story/search')
    .post(SearchController.searchStories);
  server.route('/api/story/count')
    .post(StoryController.countStories);
  server.route('/api/story/random')
    .post(StoryController.randomStory);

  // report routes
  server.route('/api/report/post-report')
    .post(ReportController.postReport);
  server.route('/api/report/get-report/:reportId')
    .get(ReportController.getReport);
  server.route('/api/get-reports/:offset/:limit')
    .get(ReportController.getReports);
  server.route('/api/report/delete/:reportId')
    .delete(ReportController.deleteReport);
  server.route('/api/report/strike-user')
    .post(ReportController.strikeUser);

  // admin routes 
  server.route('/api/admin/check/:username')
    .get(AdminController.checkAdmin);
  server.route('/api/admin/set')
    .put(AdminController.setAdmin);
  server.route('/api/admin/check-ban/:username')
    .get(AdminController.checkUserBan);
  server.route('/api/admin/strike-user')
    .put(AdminController.strikeUser);
  server.route('/api/admin/ban-user')
    .put(AdminController.banUser);
  server.route('/api/admin/unban-user')
    .put(AdminController.unbanUser);

  // email route
  server.route('/api/email/request-reset-password')
    .post(EmailController.reqResetPassword);
  server.route('/api/reset-password/change-password')
    .put(EmailController.changePasword);
  server.route('/api/email/check-token')
    .put(EmailController.checkToken);
  server.route('/api/email/token')
    .post(EmailController.checkEmailToken);
};