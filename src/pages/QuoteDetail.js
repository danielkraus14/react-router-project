import { Fragment, useEffect } from "react";
import { useParams, Route, Link, useRouteMatch } from "react-router-dom";
import Comments from '../components/comments/Comments';
import HighlightedQuote from "../components/quotes/HighlightedQuote";
import NoQuotesFound from "../components/quotes/NoQuotesFound";
import useHttp from "../hooks/use-http";
import { getSingleQuote } from "../lib/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const QuoteDetail = (props) => {

    const {sendRequest, status, data: uploadedQuote, error} = useHttp(getSingleQuote, true);
    const params = useParams();
    const {quoteId} = params;
    const match = useRouteMatch()
    
    useEffect(()=>{
        sendRequest(quoteId)
    },[sendRequest, quoteId]);

    if(status === 'pending'){
        return(
            <div className='centered'>
                <LoadingSpinner />
            </div>
        )
    };
    if (status === 'error'){
        return <p>{error}</p>
    };

    if(status === 'completed' && !uploadedQuote){
        return <NoQuotesFound />
    };

    return ( 
        <Fragment>
            <HighlightedQuote
                text={uploadedQuote.text}
                author={uploadedQuote.author}
            />
            <Route path={`${match.path}`} exact>
             <Link to={`${match.url}/comments`} className='btn--flat'>Comments</Link>
            </Route>
            <Route path={`${match.path}/comments`}>
                <Comments />
            </Route>
        </Fragment>
     );
}
 
export default QuoteDetail;