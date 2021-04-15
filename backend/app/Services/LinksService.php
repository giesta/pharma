<?php
namespace App\Services;
use Goutte\Client;
use Symfony\Component\HttpClient\HttpClient;
class LinksService
{
    /**
     * Make a call to to specified url and return formatted data
     * 
     * @param string $url
     * 
     * @return array
     */
    public function scrap($url1, $url2)
    {
        $client  = new Client(HttpClient::create(['timeout' => 60]));
        $crawler = $client->request('GET', $url1);
       //Get the symptoms part 1
        $links = $crawler->filter('.result-item')->filter('ul li a')->each(function ($link) {
            return $link->attr('href');
        });
        $valid=[];
        if(count($links) > 0){
            foreach ($links as $link){
                $newUrl = $url2.$link;
                $crawler = $client->request('GET', $newUrl);

                $values = $crawler->filter('.form-horizontal')->filter('a')->each(function ($link) {
                    return $link->attr('href');
                });
                if(count($values)>0){
                    $valid = $values;
                }
            }
        }      
      return $valid;
    }
}