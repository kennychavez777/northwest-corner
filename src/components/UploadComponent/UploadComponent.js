import React, { Component } from 'react';
import CSVReader from 'react-csv-reader';
import './UploadComponent.css';

class UploadComponent extends Component {
    constructor(props){
        super(props);

        this.state = {
            headers: [],
            tableData: [],
            existData: false,
            offer: 0,
            demand: 0,
            data: [],
            isValid: false
        }

        this.uploadFile = this.uploadFile.bind(this);
    }

    uploadFile(data){
        let headers = data[0];
        let body = data.slice(1);
        let isValid = this.validateOfferAndDemand(body);

        this.setState((state) => {
            return { headers: headers, tableData: body, existData: true, isValid: isValid }
        })
    }

    validateOfferAndDemand(data){
        let offer = 0, demand = 0, realData = [], isValid = false;
    
        for(let i = 0; i < data.length-1; i++){
            /* Offer */
            if(parseInt(data[i][data.length])){
                offer += parseInt(data[i][data.length]);
            }

            /* Demand */
            if(i >= data.length-2){
                for(let a = 1; a < data.length; a++){
                    if(parseInt(data[i][a])){
                        demand += parseInt(data[i][a]);
                    }
                }
            }

            /* Real Data */
            if(i < data.length - 2){
                for(let b = 1; b < data.length; b++){
                    let value = parseInt(data[i][b]);
                    if(value){
                        let newI = i + 1;

                        realData.push({
                            value: value,
                            x: newI,
                            y: b,
                            offer: parseInt(data[i][data.length]),
                            demand: parseInt(data[data.length - 2][b]),
                        })
                    }
                }
            }
        }

        if(demand === offer){
            isValid = true;
        }

        this.setState((state) => {
            return { offer: offer, demand: demand, data: realData }
        });

        /* Northwest Method */
        this.getNorthWest(realData);

        return isValid;
    }

    getNorthWest(data){
        for ( let a = 0; a < 1; a++ ) {
            let offer = data[a].offer, demand = data[a].demand, difference = 0;
            difference = Math.abs(offer - demand);

            if ( offer >= demand ) {
                data[a].demand = 0;
                data = this.changeRowOrColumn(data[a].x, data[a].y, 'row', data, difference);
            } else if ( offer < demand ) {
                data[a].offer = 0;
                data = this.changeRowOrColumn(data[a].y, data[a].y, 'column', data, difference);
            }
        }

    }

    changeRowOrColumn(x, y, key, data, difference){
        for ( let i = 0; i < data.length; i++ ){
            if ( key === 'row' ) {
                if ( data[i].x === x ) {
                    data[i].offer = difference;
                }
                
                if ( data[i].y === y ){
                    data[i].demand = 0;
                }
            }
            
            if ( key === 'column' ) {
                if ( data[i].y === x ) {
                    data[i].demand = difference;
                }
            }
        }

        console.log('X: ',x, 'Y: ', y, ' COLUMN: ', key, ' DATA: ', data);
        return data;
    }

    handleError(error){
        console.log('ERROR: ',error);
    }

    render(){
        let { headers, tableData, existData } = this.state;

        return (
            <div className="col-md-12">
                <CSVReader
                    cssInputClass="inputfile"
                    label="Selecciona un Archivo"
                    onFileLoaded={this.uploadFile}
                    onError={this.handleError}
                    inputId="file"
                />

                <div className="col-md-12" style={{ display: existData ? 'initial' : 'none' }}>
                    <h1>Método de Esquina Noroeste</h1>
                    <table className="table table-dark">
                        <thead>
                            <tr>
                                {
                                    headers.map((item, index) => {
                                        return (
                                            <th key={index}>{item}</th>
                                        )
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tableData.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            { item.map((iText, i) => {
                                                return (
                                                    <td key={index + '-' + i}> {iText}</td>
                                                )
                                            }) }
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default UploadComponent;