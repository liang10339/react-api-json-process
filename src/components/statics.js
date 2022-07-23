import React, { Component } from "react";
import Table from 'react-bootstrap/Table';

import StaticDataService from "../services/service";




export default class StaticList extends Component {
  constructor(props) {
    super(props);
    this.retrieveStatic = this.retrieveStatic.bind(this);
    this.state = {
      statics: [],
    };
  }

  componentDidMount() {
    this.retrieveStatic();
  }

  retrieveStatic() {
    StaticDataService.getAll()
      .then(response => {
        let length = response.data.length
        let tmpPitchType = []
        for(let i=0; i<length; i++){
            tmpPitchType.push(response.data[i].TaggedPitchType)
        }

        let objTypeCount = {}
        let tmpCount = []
        for(let i=0; i<length; i++){
            if(!objTypeCount[response.data[i].TaggedPitchType]){
                objTypeCount[response.data[i].TaggedPitchType] = 1
            }else{
                objTypeCount[response.data[i].TaggedPitchType]++
            }
        }
        for(let item in objTypeCount){
            tmpCount.push(objTypeCount[item])
        }

        let objVelo = {}
        let objVeloCount = Object.assign({},objTypeCount)
        let tmpVelo = []

        for(let i=0; i<length; i++){
            if(response.data[i].APP_VeloRel === "" && objVeloCount.hasOwnProperty(response.data[i].TaggedPitchType)){
                objVeloCount[response.data[i].TaggedPitchType] --   
            }
            if(!objVelo[response.data[i].TaggedPitchType]){
                objVelo[response.data[i].TaggedPitchType] = 0
            }
            objVelo[response.data[i].TaggedPitchType]+= Number(response.data[i].APP_VeloRel)
        }

        for(let i=0; i<Object.keys(objVelo).length; i++){
            tmpVelo.push(Math.round((Object.values(objVelo)[i]/Object.values(objVeloCount)[i] + Number.EPSILON) * 10) / 10)
        }

        let objStrike = {}
        let tmpStrike = []

        for(let i=0; i<length; i++){
            if(!objStrike[response.data[i].TaggedPitchType])
                objStrike[response.data[i].TaggedPitchType] = 0
            if(response.data[i].PitchCode === "Strk-C" || response.data[i].PitchCode === "Strk-S" || response.data[i].PitchCode === "Foul" || response.data[i].PitchCode === "In-Play")
                objStrike[response.data[i].TaggedPitchType]++
        }

        for(let i=0; i<Object.keys(objStrike).length; i++){
            tmpStrike.push(Math.round((Object.values(objStrike)[i]/Object.values(objTypeCount)[i] + Number.EPSILON) * 100) / 1)
        }

        let objPA={},objBB={},objSF={},objSH={},objH={},objHR={},objSO={}
        let tmpBABIP = []
        for(let i=0; i<length; i++){
            if(!objPA[response.data[i].TaggedPitchType])
                objPA[response.data[i].TaggedPitchType] = 0
            if(response.data[i].PlayResult !== "" || response.data[i].KorBB !== "")
                objPA[response.data[i].TaggedPitchType]++
        }
        for(let i=0; i<length; i++){
            if(!objBB[response.data[i].TaggedPitchType])
                objBB[response.data[i].TaggedPitchType] = 0
            if(response.data[i].KorBB === "HBP" || response.data[i].KorBB === "BB" || response.data[i].KorBB === "IBB")
                objBB[response.data[i].TaggedPitchType]++
        }
        for(let i=0; i<length; i++){
            if(!objSF[response.data[i].TaggedPitchType])
                objSF[response.data[i].TaggedPitchType] = 0
            if(response.data[i].PlayResult === "SF")
                objSF[response.data[i].TaggedPitchType]++
        }
        for(let i=0; i<length; i++){
            if(!objSH[response.data[i].TaggedPitchType])
                objSH[response.data[i].TaggedPitchType] = 0
            if(response.data[i].PlayResult === "SH")
                objSH[response.data[i].TaggedPitchType]++
        }
        for(let i=0; i<length; i++){
            if(!objH[response.data[i].TaggedPitchType])
                objH[response.data[i].TaggedPitchType] = 0
            if(response.data[i].PlayResult === "1B" || response.data[i].PlayResult === "2B" || response.data[i].PlayResult === "3B" || response.data[i].PlayResult === "HR")
                objH[response.data[i].TaggedPitchType]++
        }
        for(let i=0; i<length; i++){
            if(!objHR[response.data[i].TaggedPitchType])
                objHR[response.data[i].TaggedPitchType] = 0
            if(response.data[i].PlayResult === "HR")
                objHR[response.data[i].TaggedPitchType]++
        }
        for(let i=0; i<length; i++){
            if(!objSO[response.data[i].TaggedPitchType])
                objSO[response.data[i].TaggedPitchType] = 0
            if(response.data[i].KorBB === "K" || response.data[i].KorBB === "Ks" || response.data[i].KorBB === "K-DO")
                objSO[response.data[i].TaggedPitchType]++
        }
        // BABIP=(H-HR)/(PA-(BB+SF+SH)-SO-HR+SF) 
        for(let i=0; i<Object.keys(objPA).length; i++){
            tmpBABIP.push(Math.round(((Object.values(objH)[i]-Object.values(objHR)[i])/(Object.values(objPA)[i]-(Object.values(objBB)[i]+Object.values(objSF)[i]+Object.values(objSH)[i])-Object.values(objSO)[i]-Object.values(objHR)[i]+Object.values(objSF)[i]) + Number.EPSILON) * 1000) / 1000)
        }
        for(let i=0; i<tmpBABIP.length; i++){
            if(isNaN(tmpBABIP[i])) tmpBABIP[i] = "-"
        }

        this.setState({
            statics: response.data,
            pitchType: tmpPitchType,
            count: tmpCount,
            velo: tmpVelo,
            strike: tmpStrike,
            BABIP: tmpBABIP
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    
    const {pitchType,count,velo,strike,BABIP} = this.state;
    return (
        
      <div className="list row">
        <div className="col-md-6">
          <Table striped bordered hover>
      <thead>
        <tr>
          <th>球種</th>
          <th>球數</th>
          <th>平均球速</th>
          <th>好球率</th>
          <th>BABIP</th>
        </tr>
      </thead>
      <tbody>
        <tr>
            <td>
                {pitchType &&
                    Array.from(new Set(pitchType)).map((v) => (
                             <td className="list-group-item">
                            {v}
                        </td>   
                    ))
                }
            </td>
            <td>
                {count &&
                    count.map((v) => (
                        <td className="list-group-item ">
                            {v}
                        </td>         
                    ))}
            </td>
             <td>
                {velo &&
                    velo.map((v) => (
                        <td className="list-group-item ">
                            {v}
                        </td>         
                    ))}
            </td>
            <td>
                {strike &&
                    strike.map((v) => (
                        <td className="list-group-item ">
                            {v}
                        </td>         
                    ))}
            </td>
            <td>
                {BABIP &&
                    BABIP.map((v) => (
                        <td className="list-group-item ">
                            {v}
                        </td>         
                    ))}
            </td>
          </tr>
      </tbody>
    </Table>

        </div>
        <div>

        </div>


      </div>
    );
  }
}
