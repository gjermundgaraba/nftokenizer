import {empowerchain} from "@empower-plastic/empowerjs";
import {ApolloClient, InMemoryCache, ApolloProvider, gql} from '@apollo/client';


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