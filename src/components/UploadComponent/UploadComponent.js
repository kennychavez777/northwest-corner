import React, { Component } from 'react';
import CSVReader from 'react-csv-reader';
import './UploadComponent.css';

class UploadComponent extends Component {
    constructor(props){
        super(props);

        this.state = {
            headers: [],
            tableData: [],
            dataValid: false
        }

        this.uploadFile = this.uploadFile.bind(this);
    }

    uploadFile(data){
        let headers = data[0];
        let body = data.slice(1);

        this.setState((state) => {
            return { headers: headers, tableData: body, dataValid: true }
        })
    }

    handleError(error){
        console.log('ERROR: ',error);
    }

    render(){
        let { headers, tableData, dataValid } = this.state;

        return (
            <div className="col-md-12">
                <CSVReader
                    cssInputClass="inputfile"
                    label="Selecciona un Archivo"
                    onFileLoaded={this.uploadFile}
                    onError={this.handleError}
                    inputId="file"
                />

                <div className="col-md-12" style={{ display: dataValid ? 'initial' : 'none' }}>
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
                                                {/* <td key={index + '-' + i}> { (iText !== "" && i !== 0) ? 'Q. ' : '' } {iText}</td> */}
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