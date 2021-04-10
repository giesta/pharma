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
    public function scrap($url)
    {
        $client  = new Client(HttpClient::create(['timeout' => 60]));
        $crawler = $client->request('GET', $url);
       //Get the symptoms part 1
        $valid = $crawler->filter('table')->filter('tbody')->filter('tr')->filter('td')->each(function ($td, $i) {
                return $td->text();
        });
       
      return $valid;
    }
}