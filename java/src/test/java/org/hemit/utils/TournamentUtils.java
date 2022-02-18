package org.hemit.utils;

import io.restassured.response.ValidatableResponse;
import org.hemit.StatusAndContent;
import org.hemit.model.CreateResponse;
import org.hemit.model.Tournament;
import org.hemit.model.TournamentToCreate;

import static io.restassured.RestAssured.given;
import static io.restassured.RestAssured.when;

public class TournamentUtils {
    public static StatusAndContent<CreateResponse> createTournament(String tournamentName) {
        ValidatableResponse response = given()
                .contentType("application/json")
                .body(new TournamentToCreate(tournamentName))
                .when()
                .post("/tournaments")
                .then();

        int statusCode = response.extract().statusCode();
        CreateResponse content = null;
        if (statusCode == 201) {
            content = response.extract().as(CreateResponse.class);
        }

        return new StatusAndContent<>(statusCode, content);
    }

    public static StatusAndContent<Tournament> getTournamentById(String id) {
        ValidatableResponse response = when().get("/tournaments/"+id).then();

        int statusCode = response.extract().statusCode();
        Tournament content = null;
        if (statusCode == 200) {
            content = response.extract().as(Tournament.class);
        }

        return new StatusAndContent<>(statusCode, content);
    }
}
