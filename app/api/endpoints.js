/**
 * Api Endpoints
 * @flow
 * @format
 */

export const get_general_settings = '/generalsetting/getgeneralsetting';
/* Auth */
export const register = '/user/register';
export const login = '/token/auth';
export const reset_password = '/user/resetpassword';
export const login_google = '/token/login-with-gmail';
export const login_facebook = '/token/login-with-facebook';
export const login_apple = '/token/login-with-apple';
export const guest_user_login = '/token/GuestUserLogin';
/* Order */
export const get_order_list = '/order/getuserorders';
export const get_current_marathon = 'order/checkformarathonpurchased';
export const purchase_marathon_by_coupon = '/order/purchasemarathon';
/* User */
export const get_user_profile = '/user/getuserprofiledetail';
export const update_user_profile = '/user/updateprofile';
export const change_password = '/user/changepassword';
export const delete_account = '/User/DeleteAccount';
/* User Exercise*/
export const get_start_marathon = '/usermarathon/startmarathon';
export const accept_marathon_terms = '/usermarathon/acceptcourserules';
export const get_day_exercises = '/usermarathon/getdayexercise';
export const change_exercise_status = '/usermarathon/setuserexercisestatus';
export const get_comments = '/usermarathon/getcomments';
export const get_child_comments = '/usermarathon/getchildcomments';
export const post_comment = '/usermarathon/createcomment';
export const like_comment = '/marathon/likecomment';
export const get_course_detail = '/Marathon/ExtensionDescription';
export const updateDayStarValue = '/usermarathon/UpdateDayStarValue';
/* Photodiary */
export const get_contest = '/contest/getcontest';
export const get_voting_contest = '/contest/GetContestGuestUser';
export const get_contest_images = '/contest/getusercontestimages';
export const upload_contest_image = '/contest/uploadcontestimages';
export const upload_contest_image_mask = '/contest/uploadusermaskimages';
export const confirm_contest_image = '/contest/confirmcontestmaskimages';
export const take_part_in_contest = '/contest/takepartincontest';
export const accept_contest_rules = '/contest/acceptcontestrules';
export const download_collage_image = '/contest/downloadcollageimageforuser';
export const download_collage_pdf = '/contest/downloadcollageimageforuserpdf';
export const set_record_before_photo_upload =
  '/contest/setuserrecordbeforephotoupload';
export const get_record_before_photo_upload =
  '/contest/getuserrecordbeforephotoupload';
export const get_contest_finalist = '/User/GetAllCourseUers';
export const vote_finalist = '/contest/vote';
export const get_contest_winners = 'Contest/GetWinners';
export const get_challenge_winners = 'Contest/GetRejuvenationChallengeWinners';
export const get_age_bot = '/contest/UploadImageAgeBot';
/*Payment*/
export const init_order = '/Order/CreateOrder';
export const get_course_plans = '/marathon/getcourseplan';
export const googleSubscribe = '/order/googlesubscription';
export const appleSubscribe = '/order/IOSSubscription';
export const purchase_with_iap = '/Order/VerifyIOSSubscriptionData';
export const freeCourseUnsubscribe = '/Order/UnSubscribeFreeCourse';
/*User Feedback*/
export const post_user_feedback = '/usermarathon/createreview';
/*Notification*/
export const get_notifications = '/usermarathon/getnotification';
export const mark_notifications_read =
  '/usermarathon/saveusernotificationstate';
export const delete_notification = '/usermarathon/deletenotification';
/*Guest User*/
export const get_marathon_guest_user = '/marathon/GetMarathonsGuestUser';
export const get_demo_course = '/marathon/GetDemoCourseList';
export const set_notification_setting = '/marathon/SetUserNotificationSettings';
export const get_notification_setting = '/marathon/GetUserNotificationSettings';
export const set_user_language = 'User/SetUserLanguage';
