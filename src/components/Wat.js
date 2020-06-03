import React from 'react';
import '../styles.css';
import {connect} from 'react-redux';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class Wat extends React.Component {

    render(){
        return (
        <Card className="card" >
              <CardContent>
                <TextField className="txtxt" variant="outlined" multiline value={JSON.stringify(this.props.ast)} //onChange={event => this.handleChange(event)}
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
export default connect(mapStateToProps)(Wat);
