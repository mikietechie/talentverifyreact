import axios from "axios";
import React from "react";
import react from "react";

interface IUser {
  all_permissions: string[];
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  initials_picture_url: string;
  is_staff: boolean;
  is_superuser: boolean;
  role: string;
  tokens: {
    refresh: string;
    access: string;
  }
}

interface ISappListProps {
  user: IUser;
  modelName: string;
  appLabel: string;
  icon: string;
}


export class SappList extends react.Component {
  Header: react.FC
  constructor(props: ISappListProps) {
    super(props)
    this.state = {
      data: {}
    }
    this.Header = () => (
      <div>

      </div>
    )
  }

  async loadData () {
    try {
      const res = await axios.get(URL, {headers: {Authorization: `Bearer ${this.props}`}})
      this.setState({...this.state, data: res.data})
    } catch (error) {
      alert("Failed to load form!")
    }
  }

  componentDidMount () {
    this.loadData()
  }

  render () {
    return (
      <>
        <this.Header />
      </>
    )
  }
}
