import React,{useState,useEffect} from 'react';
import './App.css';
import {Table} from "antd";
import 'antd/dist/antd.css';
import axios from "axios";
import FingerprintJS from '@fingerprintjs/fingerprintjs';



const API_URL = 'http://auth.iflexi.site';

//TEST
const username = 'test-ru';
const password = '121212';
//


class App extends React.Component{


    state = {
        queries:[
        ],
        fp:{}
    }
    componentDidMount() {
        this.getFP()
            .then(res=>{
                this.setAuth(this.state.fp)
            })

    }

    render() {
        const queries = this.state.queries;
        return(
            <div className="App">

                <Table dataSource = {queries}>
                    <Table.Column title="#" dataIndex="id" key="id" />
                    <Table.Column title="status" dataIndex="status" key="status" />
                </Table>
            </div>
        )
    }

    hashCode(str) {
        let hash = 0, i = 0, len = str.length;
        while (i < len) {
            hash = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
        }
        return (hash + 2147483647) + 1;
    }

    setRefresh(){
        fetch(`${API_URL}/auth/u/${this.hashCode(username)}/refresh?device=1&fingerprint=b39b03b62bea99c5c031ffdce30a6edb`,{
            method:'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            credentials:'include'

        })
            .then(res=>{
                return res.json();
            })
            .catch(err=>{
                this.setState({queries:[...this.state.queries,{id:this.state.queries.length,status:'Ошибочка',key:this.state.queries.length}]})
                setTimeout(()=>{
                    if(this.state.queries.length > 10) clearTimeout();
                    this.getFP()
                        .then(res=>{
                            this.setRefresh();
                        })
                },4000)
            })
            .then(res=>{
                this.setState({queries:[...this.state.queries,{id:this.state.queries.length,status:'Всё ОК!',key:this.state.queries.length}]})
                setTimeout(()=>{
                    if(this.state.queries.length > 10) clearTimeout();
                    this.getFP()
                        .then(res=>{
                            this.setRefresh();
                        })
                },4000)
            })

    }

   setAuth(fingerprint){
        fetch(`${API_URL}/auth/login`,{
            method:'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            //body:JSON.stringify({username,password,device:1,fingerprint})
            body:'username=test-ru&password=121212&device=1&fingerprint=b39b03b62bea99c5c031ffdce30a6edb',
            credentials:'same-origin'
        })
            .then(res=>{
                return res.json();
            })
            .then(res=>{
                this.setState({queries:[...this.state.queries,{id:this.state.queries.length,status:'Всё ОК!',key:this.state.queries.length}]})
                setTimeout(()=>{
                    if(this.state.queries.length > 10) clearTimeout();
                    this.getFP()
                        .then(res=>{
                            this.setRefresh();
                        })
                },4000)
            })
            .catch(err=>{
                this.setState({queries:[...this.state.queries,{id:this.state.queries.length,status:'Ошибочка',key:this.state.queries.length}]})
                setTimeout(()=>{
                    if(this.state.queries.length > 10) clearTimeout();
                    this.getFP()
                        .then(res=>{
                            this.setRefresh();
                        })
                },4000)
            })
    }
    async getFP (){
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        this.setState({fp:result.visitorId})
    }
}

export default App;
