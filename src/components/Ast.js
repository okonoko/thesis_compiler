import React from 'react';
import '../styles.css';
import {connect} from 'react-redux';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {emit} from "../code/emitter";

class Ast extends React.Component {

    // handleChange = (event) => {
    //     this.props.dispatch({ type: "PARSED", value: event.target.value})
    // }

    
    handleClick = () => {
        const ast = emit(this.props.ast);
        this.props.dispatch({ type: "AST", value: ast})
    }

    render(){
        return (
        <Card className="card" >
              <CardContent>
                <TextField className="txtxt" variant="outlined" multiline value={JSON.stringify(this.props.parsed)} //onChange={event => this.handleChange(event)}
                />
              </CardContent>
            <CardActions>
              <Button size="small" color="primary" onClick={() => this.handleClick()}>
                  Submit
              </Button>
            </CardActions>
        </Card>
        );
    }
}
const mapStateToProps = state => ({
    parsed: state.parsed,
    ast: state.ast
});
export default connect(mapStateToProps)(Ast);
