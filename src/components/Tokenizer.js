import React from 'react';
import '../styles.css';
import {connect} from 'react-redux';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {tokenize} from  "../code/tokenizer";


class Tokenizer extends React.Component {

    handleChange = (event) => {
        this.props.dispatch({ type: "RAW_CODE_INPUT", value: event.target.value})
    }

    handleClick = () => {
        const tokenized = tokenize(this.props.rawCode);
        this.props.dispatch({ type: "TOKENIZED", value: tokenized})
    }


    render(){
        return (
        <Card className="card" >
              <CardContent>
                <TextField className="txtxt" variant="outlined" multiline value={this.props.rawCode} onChange={event => this.handleChange(event)}/>
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
    rawCode: state.rawCode,
    tokenized: state.tokenized,
});
export default connect(mapStateToProps)(Tokenizer);