import { useState , useEffect, useCallback} from 'react';
import classes from './Comments.module.css';
import NewCommentForm from './NewCommentForm';
import useHttp from '../../hooks/use-http';
import { getAllComments } from '../../lib/api';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../UI/LoadingSpinner';
import CommentsList from './CommentsList'

const Comments = () => {
  const [isAddingComment, setIsAddingComment] = useState(false);

  const startAddCommentHandler = () => {
    setIsAddingComment(true);
  };
  const {sendRequest, status, data:loadedComments, error } = useHttp(getAllComments);
  const params = useParams();
  const {quoteId} = params;
  console.log(loadedComments);

  useEffect( () => {
    sendRequest(quoteId);
  }, [sendRequest, quoteId]);

  const addedCommentHandler = useCallback(()=>{
    sendRequest(quoteId)
  },[sendRequest,quoteId]);

  let comments;

  if(status === 'pending'){
    
    comments = (
      <div className='centered'>
        <LoadingSpinner />
      </div>)
  };

  if(status === 'completed' && loadedComments && loadedComments.length > 0 ){
    comments = (<CommentsList comments={loadedComments} />);
  };

  if(status==='completed' && (!loadedComments || loadedComments.length === 0)){
    comments = (<p className='centered focused'>No comments where added yet</p>);
  };

  if(status === 'error'){
    comments = (<p className='centered focused'>{error}</p>);
  };

  return (
    <section className={classes.comments}>
      <h2>User Comments</h2>
      {!isAddingComment && (
        <button className='btn' onClick={startAddCommentHandler}>
          Add a Comment
        </button>
      )}
      {isAddingComment && <NewCommentForm onAddedComment={addedCommentHandler} quoteId={quoteId} />}
      {comments}
    </section>
  );
};

export default Comments;
