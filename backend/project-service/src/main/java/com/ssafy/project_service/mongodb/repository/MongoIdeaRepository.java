package com.ssafy.project_service.mongodb.repository;
import com.ssafy.project_service.mongodb.entity.MongoIdea;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;

import java.util.Optional;

public interface MongoIdeaRepository extends MongoRepository<MongoIdea, ObjectId>, CustomMongoIdeaRepository {
    @Query(value = "{ _id: ?0}", fields = "{ idea_erd:  1}")
    Optional<MongoIdea> findErdById(Long ideaId);

    @Query(value = "{ _id: ?0}", fields = "{idea_api_doc:  1}")
    Optional<MongoIdea> findIdeaApiDocs(Long ideaId);

    @Query(value = "{ _id: ?0}", fields = "{idea_req_doc:  1}")
    Optional<MongoIdea> findIdeaReqDocs(Long ideaId);

    @Query(value = "{ _id: ?0}", fields = "{ idea_proposal:  1}")
    Optional<MongoIdea> findProposalById(Long ideaId);

    @Query(value = "{ _id: ?0 }", fields = "{ idea_proposal: 1 }")
    @Update("{ '$set': { 'idea_proposal':  ?1} }")
    void updateProposal(Long ideaId, String proposal);

}
