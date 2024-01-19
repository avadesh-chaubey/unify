import React, {useState, useEffect} from 'react';
import { Card, CardActionArea, CardContent, Grid, Link } from '@material-ui/core';
import SimpleBar from 'simplebar-react';
import ModuleList from './moduleList';

export default function RoleList () {
  const [roleList, setRoleList] = useState('');
  const [selectedRole, setSelectedRole] = useState(0);

  useEffect(() => {
    setRoleList([
      {role: 'Admin 1', activate: true},
      {role: 'Admin 2', activate: true},
      {role: 'OP Manager', activate: true},
      {role: 'Pharmacy', activate: true},
      {role: 'Support Admin', activate: true},
      {role: 'Diagonostics Admin', activate: true},
      {role: 'Unit Admin', activate: true},
    ]);
  }, []);

  const handleCardClick = (e, i) => {
    setSelectedRole(i);
  };

  const handleRoleAccess = (e, roleIndex) => {
    e.preventDefault();
    roleList[roleIndex].activate = !roleList[roleIndex].activate;
    setRoleList(prevState => [...roleList]);
  }

  return (
    <div className="mainView role-module">
      {
        roleList.length
        ? (
          <SimpleBar className="doctorList role-list-scroll centre-unit-list role-card">
            {roleList.map((data, i) => (
              <Card
                id={`doc-list-${i}`}
                className={
                  `doctorcard centre-unit-card ${(i === selectedRole ? "activeCard" : "")}`
                }
                key={i}
              >
                <CardActionArea
                  onClick={(e) => handleCardClick(e, i)}
                >
                  <CardContent>
                    <div className="docDetails" style={{ width: '100%'}}>
                      <Grid container className="grid-role" spacing={1}>
                        <Grid item xs={9}>
                          <span className="docName hospital-unit-width role-name">
                            {data.role}
                          </span>
                        </Grid>
                        <Grid item xs={3}>
                          <Link href="#" onClick={(e) => handleRoleAccess(e, i)}>
                            <img src="/disable_icon.svg" className={`disble-icon ${!data.activate ? 'deactivate-role' : ''}`} />
                          </Link>
                        </Grid>
                      </Grid>
                    </div>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </SimpleBar>
        )
        : (
          <div style={{ textAlign: "center", marginTop: "10%" }}>
            <h3>Roles Not Added.</h3>
          </div>
        )
      }
      {/* <ModuleList /> */}
    </div>
    
  );
}
