CREATE PROCEDURE FI_SP_VerificaCpfPorId
    @CPF VARCHAR(14),
    @ID BIGINT
AS
BEGIN
    DECLARE @Existe INT;

    SET @Existe = (
        SELECT CASE WHEN EXISTS (
            SELECT 1 FROM CLIENTES WHERE CPF = @CPF AND Id <> @ID
        ) THEN 1 ELSE 0 END
    );

    SELECT @Existe AS ExisteCliente;
END