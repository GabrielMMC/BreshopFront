import React from 'react'
import SaveIcon from '@mui/icons-material/Save';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';

const SavePreset = (props) => {
  const history = useNavigate()

  return (
    <div className="d-flex my-5">
      <div className="align-self-center">
        <Button variant='contained' onClick={() => history(props.backPath)} startIcon={<ReplyAllIcon />}> Voltar</Button>
      </div>
      <div className="align-self-center ms-auto">
        <LoadingButton variant='contained' loading={props.loading} onClick={props.handleSave} loadingPosition="end" endIcon={<SaveIcon />}>Salvar</LoadingButton>
      </div>
    </div>
  )
}

export default SavePreset