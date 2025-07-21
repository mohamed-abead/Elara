import { NextResponse } from 'next/server';

const appleAppSiteAssociation =
{
  "applinks": {
      "details": [
           {
             "appIDs": [ "JDQVB9SCWF.com.anonymous.elara-react-native" ],
             "components": [
               {
                  "/": "/plaid/redirect/*",
                  "comment": "Matches any URL with a path that starts with /plaid/redirect/."
               },
               {
                  "/": "/banking/redirect/*",
                  "comment": "Matches any URL with a path that starts with /banking/redirect/."
               }
             ]
           }
       ]
   }
};

export async function GET() {
  return new NextResponse(JSON.stringify(appleAppSiteAssociation), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
