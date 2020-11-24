import React,{Component} from 'react';
import { Card, CardImg, CardText, CardBody,CardTitle, Breadcrumb, BreadcrumbItem,
            Button,Row,Col,Label,Modal,ModalHeader,ModalBody} from 'reactstrap';
import { Link } from 'react-router-dom';
import {Control,LocalForm,Errors} from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

const required=(val)=>val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component{
    constructor(props){
        super(props);
        this.state={
            isModalOpen:false
        }
        this.toggleModal=this.toggleModal.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        }

    toggleModal(){
        this.setState({
            isModalOpen: !this.state.isModalOpen
        })
    }   
    
    handleSubmit(values){
        console.log("The Current State is:"+JSON.stringify(values));
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }
    
    render(){
        return(
            <div class="container">
                <LocalForm>
                    <Button outline onClick={this.toggleModal}>
                        <span className="fa fa-pencil" /> Submit Comment
                    </Button>
                </LocalForm>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values)=>this.handleSubmit(values)}>
                            <Row className="form-group">
                                <Col>
                                    <Label htmlfor="rating">Rating</Label>
                                    <Control.select model=".rating" id="rating" name="rating" className="form-control" >
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Label htmlFor="author">Your Name</Label>
                                    <Control.text model=".author" id="author" name="author" className="form-control" 
                                    validators={{required,minLength:minLength(3),maxLength:maxLength(15)}}/>
                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            required: 'Required ',
                                            minLength: 'Must be greater than 2 Characters',
                                            maxLength: 'Must be 15 Characters or less'
                                        }}
                                     /> 
                                </Col> 
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Label htmlFor="comment">Comment</Label>
                                    <Control.textarea rows="6" model=".comment" id="comment" name="comment" className="form-control" />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Button type="submit"color="primary">Submit</Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

function  RenderDish({dish}) {
        return (
            <Card>
                <CardImg width="100%" src={baseUrl+dish.image} alt={dish.name} />
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
        );
    }

function RenderComments({comments,dishId,postComment}) {
        var commentList = comments.map(comment => {
            return (
                <li key={comment.id} >
                    {comment.comment}
                    <br /><br />
                    -- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                    <br /><br />
                </li>
                 
            );
        });

        return (
            <div className="container">
                <div className="row">
                    <h4>Comments</h4>
                    <ul className="list-unstyled">
                        {commentList}
                        <CommentForm dishId={dishId} postComment={postComment}/>
                    </ul>
                </div>
            </div>

        );
    }

const DishDetail=(props)=> {

        if (props.isLoading) {
            return(
                <div className="container">
                    <div className="row">            
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess) {
            return(
                <div className="container">
                    <div className="row">            
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if (props.dish != null) {
            return (
                <div class="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>                
                </div>
                <div className="row">
                    <div className="col-12 col-md-5 m-1">
                       <RenderDish dish={props.dish} />
                    </div>
                    <div className="col-12 col-md-5 m-1">
                        <RenderComments comments={props.comments}
                                postComment={props.postComment}
                                dishId={props.dish.id} />
                    </div>
                </div>
                </div>
            );
        }
    }

export default DishDetail; 