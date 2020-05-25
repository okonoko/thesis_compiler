import React from 'react';
import '../styles.css';
import {connect} from 'react-redux';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {parse} from "../code/parser";

class Parser extends React.Component {


    handleClick = () => {
        const parsed = parse(this.props.tokenized);
        this.props.dispatch({ type: "PARSED", value: parsed});
    }

    render(){
        return (
        <Card className="card" >
              <CardContent>
                <TextField className="txtxt" variant="outlined" multiline value={JSON.stringify(this.props.tokenized) || ''} //onChange={event => this.handleChange(event)}
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
    tokenized: state.tokenized,
    parsed: state.parsed,
});
export default connect(mapStateToProps)(Parser);