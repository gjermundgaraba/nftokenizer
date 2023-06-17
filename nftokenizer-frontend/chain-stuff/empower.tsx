import {empowerchain, getSigningTM37EmpowerchainClient} from "@empower-plastic/empowerjs";
import {ApolloClient, InMemoryCache, ApolloProvider, gql} from '@apollo/client';
import {OfflineSigner} from "@cosmjs/proto-signing";
import {GasPrice} from "@cosmjs/stargate";
import {calculateFee} from "@cosmjs/stargate/build/fee";


const rpcEndpoint = "https://empower-testnet-rpc.polkachu.com:443";
const client = new ApolloClient({
  uri: 'https://testnet.empowerchain.io:3000',
  cache: new InMemoryCache(),
});

export const getPlasticCreditBalance = async (address: string, denom: string) => {
  const queryClient = await empowerchain.ClientFactory.createRPCQueryClient({rpcEndpoint});
  const balanceResponse = await queryClient.empowerchain.plasticcredit.creditBalance({
    owner: address,
    denom: denom,
  });

  const activeBalance = balanceResponse.balance?.balance?.active;
  return (typeof activeBalance !== 'undefined') ? Number(activeBalance) : 0;
}

export const depositPlasticCredit = async (addressOfSigner: string, signer: OfflineSigner, depositAddress: string, denom: string, amount: number) => {
  const signingClient = await getSigningTM37EmpowerchainClient({
      rpcEndpoint,
      signer,
      gasPrice: GasPrice.fromString('0.025umpwr'),
    }
  );

  const {transferCredits} = empowerchain.plasticcredit.MessageComposer.withTypeUrl;
  const transferCreditsMsg = transferCredits({
    from: addressOfSigner,
    to: depositAddress,
    denom,
    amount: BigInt(amount),
    retire: false,
    retiringEntityName: "",
    retiringEntityAdditionalData: "",
  });
  const response = await signingClient.signAndBroadcast(
    addressOfSigner,
    [transferCreditsMsg],
    calculateFee(200000, GasPrice.fromString('0.025umpwr')),
  );
  if (response && !response.code) {
    return;
  } else {
    throw new Error("Transfering credits failed " + response.rawLog)
  }
}

export const getCredits = async (address: string) => {
  const query = gql`{
    query {
    creditBalances(
    filter:{
      wallet:{
        address:{equalTo:"${address}"}
      }
    }){
      totalCount
      nodes{
      wallet{
          address
        }
        creditCollection{
          denom
          creditType
          creditData{
            nodes{
            mediaFiles{
              nodes{
                name
                url
              }
            }
              eventData{
                nodes{
                  material{
                    nodes{
                      key
                      value

                    }
                  }
                }
              }
            }
          }
        }
        amountActive
        amountRetired
      }
    }
  }
}`;
  const {data} = await client.query({
    query: query,
  });
  console.log(data);
  return data?.query?.creditBalances?.nodes || [];

}