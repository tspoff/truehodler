import React from 'react'
import getWeb3 from './getWeb3'
import getAccounts from './getAccounts'
import getContract from './getContract'
import contractDefinition from './contracts/CoinCore.json'

export default class Web3Container extends React.Component {
  state = { web3: null, accounts: null, coreInstance: null }

  async componentDidMount () {
    try {
      const web3 = await getWeb3()
      const accounts = await getAccounts(web3)
      const coreInstance = await getContract(web3, contractDefinition)
      this.setState({ web3, accounts, coreInstance })
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`)
      console.log(error)
    }
  }

  render () {
    const { web3, accounts, coreInstance } = this.state
    return web3 && accounts
      ? this.props.render({ web3, accounts, coreInstance })
      : this.props.renderLoading()
  }
}
