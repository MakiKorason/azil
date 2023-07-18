import { useCallback, useEffect, useState } from "react";
import Axios from "../../apis/Axios";
import { Button, ButtonGroup, Col, Collapse, Form, FormGroup, FormLabel, Row, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const Ljubimci=()=>{
  let udomljavanje={

   datumVreme: null,
   ljubimac:null
  }
   
  // const [novoUdomljavanje,setNovoUdomljavanje]=useState(udomljavanje);
  const [search, setSearch] = useState({ pol: "", kategorijaId: -1, opis:""})
  const [ljubimci, setLjubimci] = useState([])
  const [kategorije, setKategorije] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [pageNo, setPageNo] = useState(0)
  const  navigate = useNavigate()
  const [showSearch, setShowSearch] = useState(false)

  const getData = () => {
    getKategorije();
    getLjubimci(0);

  }

  useEffect(()=>{
    getData();
  }, [])


  const getLjubimci = (page) =>  {
    let config = { params: {
        pageNo: page
      } };
      if (search.pol != "") {
        config.params.pol = search.pol;
      }
  
      if (search.kategorijaId != -1) {
        config.params.kategorijaId = search.kategorijaId;
      }
      if (search.opis != "") {
        config.params.opis = search.opis;
      }
  

      Axios.get("/ljubimci", config )

          .then((result) => {
            console.log(result)
            setPageNo(page)
            setLjubimci(result.data)
            setTotalPages(result.headers['total-pages'])
                      
          })
          .catch(error => {
              console.log("Nije uspelo dobavljanje");
            
          });
  }

 const getKategorije = () => {
Axios.get("/kategorije")
  .then((result) => {
      setKategorije(result.data)
  })
  .catch((err=>{console.log("Nije uspelo dobavljanje")}))
}


const goToAdd=()=>{
navigate("/ljubimci/add");
 } 

 const deleteLjubimac= (ljubimacId) => {
    Axios.delete('/ljubimci/' + ljubimacId)
    .then(res => {
        console.log(res);
        alert(' deleted successfully!');
        window.location.reload();
    })
    .catch(error => {
        console.log(error);
        alert('Nije vam dostupno brisanje ljubimca');
     });
}



const searchValueInputChange = (event) => {
    let newSearch = {...search}

    const name = event.target.name;
    const value = event.target.value;

    newSearch[name] = value
    setSearch(newSearch);
  }

  const doSearch = () => {
    getLjubimci(0);
  }


  return(
<>
  
<h1>Ljubimci</h1>

    <Form.Group>
    <Form.Check type="checkbox" label="Show search form" onClick={(event) => setShowSearch(event.target.checked)}/>
    </Form.Group>
    <Collapse in={showSearch}>
    <Col sm="8">
   <Form style={{ width: "99%" }}>
    <Form.Group>
          <Form.Label>POL</Form.Label>
          <Form.Select
            value={search.pol}
            name="pol"
            as="input"
            onChange={(e) => searchValueInputChange(e)}>
              <option></option>
           <option value="muski">Muski</option>
          <option value="zenski">Zenski</option></Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Kategorija</Form.Label>
          <Form.Control
            onChange={(event) => searchValueInputChange(event)}
            name="kategorijaId"
            value={search.kategorijaId}
            as="select"
          >
            <option value={-1}></option>
            {kategorije.map((kategorija) => {
              return (
                <option value={kategorija.id} key={kategorija.id}>
                  {kategorija.naziv}
                </option>
              );
            })}
          </Form.Control>
        </Form.Group> 
        <Form.Group>
          <Form.Label>OPIS</Form.Label>
          <Form.Control
            value={search.opis}
            name="opis"
            as="input"
            onChange={(e) => searchValueInputChange(e)}
          ></Form.Control>
        </Form.Group>
        
         <Button onClick={() => doSearch()}>Search</Button>
</Form>
</Col>
</Collapse>
<br/>
<Button variant="outline-success"  onClick={() => goToAdd()}>Add</Button>
               
<Table bordered striped style={{ marginTop: 5 }} >
                  <thead>
                      <tr>
                          <th>Ime</th>
                          <th>Starost(broj meseci)</th> 
                          <th>Vakcinisan</th>   
                          <th>Pol</th>
                          <th>Tezina</th>
                          <th>Opis</th>
                        <th>Kategorija</th>
                        <th colSpan={2}>Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      {ljubimci.map((ljubimac, index) => {
                          return (
                              <tr key={ljubimac.id}>
                                  <td>{ljubimac.ime}</td>
                                  <td>{ljubimac.brojMeseci}</td>     
                                  <td>{ljubimac.vakcinisan===true?"vakcinisan":"nije vakcinisan"}</td>
                                  <td>{ljubimac.pol}</td> 
                                  <td>{ljubimac.tezina}</td>
                                  <td>{ljubimac.opis}</td>
                                  <td>{ljubimac.kategorijaNaziv}</td>
                            
                                  {window.localStorage['role']==="ROLE_ADMIN" ?
                                  <td><Button variant="danger" 
                                className="button button-navy" onClick={() => deleteLjubimac(ljubimac.id)}>Delete</Button>
                                </td>:null}
                              </tr>  
                          )
                      })}
                  </tbody>
              </Table>
              <ButtonGroup style={{ marginTop:0, float:"right"}}>
        <Button 
          style={{ margin: 3, width: 90}}
          disabled={pageNo==0} onClick={()=>getLjubimci(pageNo-1)}>
          Previous
        </Button>
        <Button
          style={{ margin: 3, width: 90}}
          disabled={pageNo==totalPages-1} onClick={()=>getLjubimci(pageNo+1)}>
          Next
        </Button>
      </ButtonGroup>
         </>
)

}
export default Ljubimci;