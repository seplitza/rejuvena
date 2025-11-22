/**
 * Frequently Asked Questions
 * @flow
 * @format
 */

import React, {useState, memo} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Text,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import initials from 'initials';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {KeyboardAwareView} from 'react-native-keyboard-aware-view';
import SegmentedTab from 'react-native-segmented-control-tab';
import {request, endpoints} from '@app/api';
import {showToast} from '@app/global';
import {withTranslation, useTranslation} from '@app/translations';
import {Label, Input, CacheImage, Icon} from '@app/components';
import {ImageSource} from '@app/common';
import {getComments, getChildComments, postComment} from '../slice';
import {removeHtmlTags} from '@app/utils';
import {selectUserId} from '@app/modules/user-profile';
import {
  selectComments,
  selectCommentRequests,
  selectAllComments,
} from '../selectors';
import {commentStyles as styles} from './styles';

type CommentProps = {
  comment: Object,
  onPressReply: Function,
};

const Comment = memo((props: CommentProps) => {
  const {t} = useTranslation();
  const [likePending, setLikePending] = useState(false);
  const [updatedLike, setUpdatedLike] = useState();
  const {comment, onPressReply, onUpdate, isChildComment} = props;
  const {
    id,
    userModel,
    comment: _message,
    like: oldLike,
    likeCounts,
    recipientNameAndComment,
    isGuestUser,
  } = comment;
  const {fullName, profilePicture} = userModel || {};
  const like = updatedLike !== undefined ? updatedLike : oldLike;
  const _recipientName = recipientNameAndComment?.[0];
  const _recipientComment = recipientNameAndComment?.[1];

  const likeUnLikeComment = async () => {
    try {
      setLikePending(true);
      const newLike = !like;
      await request.get(endpoints.like_comment, {
        params: {
          commentId: id,
          like: newLike,
        },
      });
      setUpdatedLike(newLike);
      onUpdate();
      showToast({
        message: newLike
          ? t('userMarathonDailyExercisePage.commentLiked')
          : t('userMarathonDailyExercisePage.commentUnLiked'),
        duration: 2000,
        position: 'top',
        backgroundColor: 'rgb(0,25,107)',
      });
    } catch {
    } finally {
      setLikePending(false);
    }
  };

  const message = removeHtmlTags(_message);
  const recipientName = removeHtmlTags(_recipientName);
  const recipientComment = removeHtmlTags(_recipientComment);

  const likeAndLikesLabel =
    likeCounts > 1
      ? t('userMarathonDailyExercisePage.likes')
      : t('userMarathonDailyExercisePage.like');

  return (
    <>
      <View style={styles.commentContainer} key={id}>
        <View style={styles.profilePictureContainer}>
          <Label style={styles.nameInitialStyle}>
            {initials(isGuestUser ? 'Guest' : fullName).toUpperCase()}
          </Label>
          <CacheImage
            source={{uri: profilePicture}}
            style={styles.profileImageStyle}
          />
        </View>

        <View style={styles.commentDetail}>
          <View style={styles.commentSection}>
            <Text style={styles.nameAndMessageSection} allowFontScaling={false}>
              <Label style={styles.userNameStyle}>
                {isGuestUser ? 'Guest' : fullName}{' '}
              </Label>
              {isChildComment && (
                <Label
                  style={[styles.userQuestionStyle, styles.recipientNameStyle]}>
                  {isGuestUser
                    ? recipientName?.trim() + 'guest'
                    : recipientName}
                </Label>
              )}
              <Label style={styles.userQuestionStyle}>
                {isChildComment ? recipientComment : message}
              </Label>
            </Text>

            <TouchableOpacity
              disabled={likePending}
              onPress={likeUnLikeComment}>
              {likePending ? (
                <ActivityIndicator color="rgb(0,25,107)" />
              ) : (
                <Icon
                  type="AntDesign"
                  name="like1"
                  style={[styles.iconStyle, like && styles.activeIconStyle]}
                />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.replyButtonContainer}>
            {!!likeCounts && (
              <Label style={styles.replyLabelStyle}>
                {`${likeCounts} ${likeAndLikesLabel}`}
              </Label>
            )}
            <TouchableOpacity
              onPress={() => onPressReply(id, comment)}
              hitSlop={{top: 20, bottom: 20}}>
              <Label style={styles.replyLabelStyle}>
                {t('userMarathonDailyExercisePage.toReply')}
              </Label>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
});

type Props = {
  exerciseId: string,
  getComments: typeof getComments,
  getChildComments: typeof getChildComments,
  comments: Array<Object>,
  commentsRequests: Array<string>,
  allComments: Object,
};

type State = {
  commentShown: boolean,
  visibleAnswerSections: Array<string>,
};
const commentInputMinHeight = 40;
const commentInputMaxHeight = 160;
class FAQ extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      commentShown: false,
      visibleAnswerSections: [],
      replyComment: {},
      value: '',
      selectedCommentTypeIndex: 0,
      commentInputHeight: commentInputMinHeight,
    };
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    this.getComments();
    if (Platform.OS === 'android') {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this._keyboardDidShow,
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        this._keyboardDidHide,
      );
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener?.remove();
    this.keyboardDidHideListener?.remove();
  }

  _keyboardDidShow = () => {
    this.props.showTab && this.props.showTab();
  };

  _keyboardDidHide = () => {
    this.setState({replyComment: {}});
    this.props.hideTab && this.props.hideTab();
  };

  getComments = () => {
    this.props.getComments({exerciseId: this.props.exerciseId});
  };

  getChildComments(commentId, exerciseId) {
    this.props.getChildComments({commentId, exerciseId});
  }

  setCommentShown = () => {
    this.setState((state) => ({commentShown: !state.commentShown}));
  };

  onPressReply = (id, comment) => {
    this.inputRef.current?.blur();
    this.inputRef.current?.focus();
    this.setState({replyComment: comment, value: ''});
  };

  onPressSeeAnswer(commentId, exerciseId) {
    let visibleAnswerSections = this.state.visibleAnswerSections;
    if (visibleAnswerSections?.includes(commentId)) {
      visibleAnswerSections = visibleAnswerSections.filter(
        (id) => id !== commentId,
      );
    } else {
      this.getChildComments(commentId, exerciseId);
      visibleAnswerSections.push(commentId);
    }
    this.setState({visibleAnswerSections});
  }

  /**
   * To support web implementation we need to create reply
   * as html otherwise reply will not sync with web side
   */
  createHtmlComment(newComment, name) {
    return `<label style="color: #003569;">@${name} </label> ${newComment}`;
  }

  postComment = (newComment, parentCommentDetail) => {
    this.inputRef.current?.blur();
    const {id, parentCommentId, exerciseId, userModel} = parentCommentDetail;
    this.props.postComment({
      comment: id
        ? this.createHtmlComment(newComment, userModel?.fullName)
        : newComment,
      commentId: parentCommentId || id,
      parentCommentId: id,
      exerciseId,
    });
    this.setState({replyComment: {}});
  };

  isGettingFaq(id) {
    return this.props.commentsRequests?.includes(id);
  }

  getReplyCount(comment) {
    const {id, childCommentCount} = comment;
    return this.props.allComments[id]?.length || childCommentCount;
  }

  replyingTo = () => {
    this.setState({replyComment: {}, value: ''});
  };

  onPressSend = () => {
    const {replyComment, value} = this.state;

    Keyboard.dismiss();
    this.setState({value: ''});
    this.postComment(
      value,
      replyComment.hasOwnProperty('parentCommentId')
        ? replyComment
        : {
            exerciseId: this.props.exerciseId,
          },
    );
  };

  setCommentType(index) {
    this.setState({selectedCommentTypeIndex: index});
  }

  getCommentInputHeight = (event) => {
    const {height} = event?.nativeEvent?.contentSize;
    if (height <= commentInputMaxHeight && height > commentInputMinHeight) {
      this.setState({commentInputHeight: height});
    } else if (height < commentInputMinHeight) {
      this.setState({commentInputHeight: commentInputMinHeight});
    }
  };

  renderAdminReply(commentId) {
    const {allComments} = this.props;
    const {exerciseId} = this.props;

    return (
      <View style={styles.childCommentSection}>
        {allComments[commentId]?.map((comment) => {
          const {id} = comment;
          return (
            <Comment
              key={id}
              comment={comment}
              onPressReply={this.onPressReply}
              onUpdate={() => this.getChildComments(commentId, exerciseId)}
              isChildComment={true}
            />
          );
        })}
      </View>
    );
  }

  render() {
    const {
      visibleAnswerSections,
      replyComment,
      value,
      selectedCommentTypeIndex,
      commentInputHeight,
    } = this.state;
    const {t, comments, userId} = this.props;
    let filteredComments = comments;
    const isMyCommentsSelected = selectedCommentTypeIndex === 1;
    if (isMyCommentsSelected) {
      filteredComments = comments?.filter(
        (comment) => comment.userId === userId,
      );
    }

    return (
      <>
        <KeyboardAwareView animated={true} useNativeDriver>
          {!!comments?.length && (
            <SegmentedTab
              values={[
                t('userMarathonDailyExercisePage.allComments'),
                t('userMarathonDailyExercisePage.myComments'),
              ]}
              selectedIndex={selectedCommentTypeIndex}
              onTabPress={(index) => this.setCommentType(index)}
              tabsContainerStyle={styles.tabsContainerStyle}
              tabStyle={styles.tabStyle}
              tabTextStyle={styles.tabTextStyle}
              activeTabStyle={styles.activeTabStyle}
            />
          )}

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollViewStyle}
            showsVerticalScrollIndicator={false}>
            {filteredComments?.map((comment) => {
              const {id, exerciseId} = comment;
              const replyCount = this.getReplyCount(comment);
              return (
                <View key={id}>
                  <Comment
                    comment={comment}
                    onPressReply={this.onPressReply}
                    onUpdate={this.getComments}
                  />

                  {replyCount > 0 && (
                    <>
                      <View style={styles.seeAnswerContainer}>
                        <TouchableOpacity
                          onPress={() => this.onPressSeeAnswer(id, exerciseId)}>
                          <Label style={styles.seeAnswerLabelStyle}>
                            {visibleAnswerSections?.includes(id)
                              ? t('userMarathonDailyExercisePage.hideAns')
                              : `${t(
                                  'userMarathonDailyExercisePage.seeAns',
                                )} (${replyCount})`}
                          </Label>
                        </TouchableOpacity>

                        {this.isGettingFaq(id) && (
                          <ActivityIndicator
                            color={styles.activityIndicator.color}
                          />
                        )}
                      </View>

                      {visibleAnswerSections?.includes(id) &&
                        this.renderAdminReply(id)}
                    </>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {!filteredComments?.length && (
            <Label style={styles.noCommentsYet}>
              {t('userMarathonDailyExercisePage.noComments')}
            </Label>
          )}
          {replyComment.hasOwnProperty('parentCommentId') && (
            <View style={styles.replyingToContainer}>
              <Label style={styles.replyingToStyle}>
                {`${t('userMarathonDailyExercisePage.replyingTo')} ${
                  replyComment?.userModel?.fullName.trim() || 'Guest'
                }`}
              </Label>
              <Pressable onPress={this.replyingTo}>
                <Icon type="EvilIcons" name="close" style={styles.closeIcon} />
              </Pressable>
            </View>
          )}

          <View style={styles.replyInputBox}>
            <Input
              onInputRef={(ref) => {
                this.inputRef.current = ref;
              }}
              placeholder={t('userMarathonDailyExercisePage.enterComment')}
              value={value}
              onChangeText={(text) =>
                this.setState({value: text.replace(/^\s+/g, '')})
              }
              containerStyle={[
                styles.inputContainerStyle,
                {height: commentInputHeight},
              ]}
              inputStyle={[styles.inputStyle, {height: commentInputHeight}]}
              multiline
              onContentSizeChange={this.getCommentInputHeight}
            />
            <TouchableOpacity disabled={!value} onPress={this.onPressSend}>
              <Image
                source={ImageSource.send}
                style={[
                  styles.messageIconStyle,
                  !value && styles.disableMessageIconStyle,
                ]}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAwareView>
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) =>
  createStructuredSelector({
    comments: selectComments(state, ownProps.exerciseId),
    commentsRequests: selectCommentRequests(state),
    allComments: selectAllComments(state),
    userId: selectUserId,
  });

export default withTranslation()(
  connect(mapStateToProps, {
    getComments,
    getChildComments,
    postComment,
  })(FAQ),
);
